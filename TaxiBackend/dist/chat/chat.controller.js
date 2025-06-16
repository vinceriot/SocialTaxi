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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_id_decorator_1 = require("../common/decorators/user-id.decorator");
class SendMessageDto {
    conversationId;
    text;
}
class GetMessagesQuery {
    since;
}
class MarkReadDto {
    messageId;
}
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    createUserDriver(userId, dto) {
        return this.chatService.createUserDriverChat(userId, dto.driverId);
    }
    createUserSupport(userId) {
        return this.chatService.createUserSupportChat(userId);
    }
    createDriverSupport(driverId) {
        return this.chatService.createDriverSupportChat(driverId);
    }
    sendMessage(senderId, dto) {
        return this.chatService.sendMessage(senderId, dto.conversationId, dto.text);
    }
    getMessages(userId, conversationId, query) {
        const since = query.since ? new Date(query.since) : undefined;
        return this.chatService.getMessages(conversationId, userId, since);
    }
    markRead(userId, dto) {
        return this.chatService.markAsRead(dto.messageId, userId);
    }
    getUserSupportChats(userId) {
        return this.chatService.getUserSupportChats(userId);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('user-driver'),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "createUserDriver", null);
__decorate([
    (0, common_1.Post)('user-support'),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "createUserSupport", null);
__decorate([
    (0, common_1.Post)('driver-support'),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "createDriverSupport", null);
__decorate([
    (0, common_1.Post)('message'),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SendMessageDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, GetMessagesQuery]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('read'),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, MarkReadDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "markRead", null);
__decorate([
    (0, common_1.Get)('support'),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getUserSupportChats", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map