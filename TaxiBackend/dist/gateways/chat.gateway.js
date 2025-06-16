"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("../chat/chat.service");
const jwt_1 = require("@nestjs/jwt");
let ChatGateway = class ChatGateway {
    chatService;
    jwtService;
    constructor(chatService, jwtService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
    }
    server;
    async handleConnection(client) {
        const token = client.handshake.auth?.token;
        console.log('📡 Новый клиент подключился:', client.id);
        console.log('🔐 Полученный токен:', token);
        if (!token) {
            console.warn('🚫 Нет токена!');
            client.disconnect();
            return;
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            client.data.user = { id: payload.sub, roles: payload.roles || [] };
            console.log('✅ Пользователь подключён:', client.data.user.id);
        }
        catch (err) {
            console.warn('🚫 Невалидный токен!');
            client.disconnect();
        }
    }
    handleJoinChat(conversationId, client) {
        client.join(`chat:${conversationId}`);
        console.log(`👥 Пользователь ${client.data.user.id} подписался на комнату chat:${conversationId}`);
    }
    async handleSendMessage(payload, client) {
        const user = client.data.user;
        if (!user)
            return;
        const saved = await this.chatService.sendMessage(user.id, payload.conversationId, payload.text);
        this.server.to(`chat:${payload.conversationId}`).emit('chat:message', {
            id: saved.id,
            from: saved.sender.id,
            text: saved.text,
            timestamp: saved.sentAt,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:send'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: '/ws', cors: true }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map