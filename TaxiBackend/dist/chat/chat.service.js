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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_conversation_entity_1 = require("./entities/chat-conversation.entity");
const chat_participant_entity_1 = require("./entities/chat-participant.entity");
const chat_message_entity_1 = require("./entities/chat-message.entity");
const message_read_entity_1 = require("./entities/message-read.entity");
const user_entity_1 = require("../user/user.entity");
let ChatService = class ChatService {
    convRepo;
    partRepo;
    msgRepo;
    readRepo;
    userRepo;
    constructor(convRepo, partRepo, msgRepo, readRepo, userRepo) {
        this.convRepo = convRepo;
        this.partRepo = partRepo;
        this.msgRepo = msgRepo;
        this.readRepo = readRepo;
        this.userRepo = userRepo;
    }
    async createUserDriverChat(userId, driverId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const driver = await this.userRepo.findOne({ where: { id: driverId } });
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        const conv = new chat_conversation_entity_1.ChatConversation();
        conv.type = 'user_driver';
        const partUser = new chat_participant_entity_1.ChatParticipant();
        partUser.user = user;
        partUser.role = 'user';
        const partDriver = new chat_participant_entity_1.ChatParticipant();
        partDriver.user = driver;
        partDriver.role = 'driver';
        conv.participants = [partUser, partDriver];
        return this.convRepo.save(conv);
    }
    async createUserSupportChat(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const conv = new chat_conversation_entity_1.ChatConversation();
        conv.type = 'user_support';
        const partUser = new chat_participant_entity_1.ChatParticipant();
        partUser.user = user;
        partUser.role = 'user';
        conv.participants = [partUser];
        return this.convRepo.save(conv);
    }
    async createDriverSupportChat(driverId) {
        const driver = await this.userRepo.findOne({ where: { id: driverId } });
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        const conv = new chat_conversation_entity_1.ChatConversation();
        conv.type = 'driver_support';
        const partDriver = new chat_participant_entity_1.ChatParticipant();
        partDriver.user = driver;
        partDriver.role = 'driver';
        conv.participants = [partDriver];
        return this.convRepo.save(conv);
    }
    async sendMessage(senderId, conversationId, text) {
        const conv = await this.convRepo.findOne({
            where: { id: conversationId },
            relations: ['participants'],
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        const isInChat = conv.participants.some(p => p.user.id === senderId);
        if (!isInChat)
            throw new common_1.ForbiddenException('Sender is not in this conversation');
        const sender = await this.userRepo.findOne({
            where: { id: senderId },
        });
        if (!sender)
            throw new common_1.NotFoundException('Sender not found');
        const msg = new chat_message_entity_1.ChatMessage();
        msg.conversation = conv;
        msg.sender = sender;
        msg.text = text;
        return this.msgRepo.save(msg);
    }
    async getMessages(conversationId, userId, since) {
        const conv = await this.convRepo.findOne({
            where: { id: conversationId },
            relations: ['participants'],
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        const isInChat = conv.participants.some(p => p.user.id === userId);
        if (!isInChat)
            throw new common_1.ForbiddenException('User is not in this conversation');
        const qb = this.msgRepo
            .createQueryBuilder('m')
            .leftJoinAndSelect('m.sender', 'sender')
            .where('m.conversationId = :cid', { cid: conversationId });
        if (since) {
            qb.andWhere('m.sentAt > :since', { since });
        }
        return qb.orderBy('m.sentAt', 'ASC').getMany();
    }
    async markAsRead(messageId, userId) {
        const msg = await this.msgRepo.findOne({
            where: { id: messageId },
            relations: ['conversation', 'conversation.participants'],
        });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
        const isInChat = msg.conversation.participants.some(p => p.user.id === userId);
        if (!isInChat)
            throw new common_1.ForbiddenException('Not a participant');
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const already = await this.readRepo.findOne({
            where: {
                message: { id: messageId },
                user: { id: userId },
            },
        });
        if (already)
            return already;
        const read = new message_read_entity_1.MessageRead();
        read.message = msg;
        read.user = user;
        return this.readRepo.save(read);
    }
    async getUserSupportChats(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.convRepo
            .createQueryBuilder('conv')
            .leftJoin('conv.participants', 'p')
            .where('conv.type = :type', { type: 'user_support' })
            .andWhere('p.user.id = :uid', { uid: userId })
            .getMany();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_conversation_entity_1.ChatConversation)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_participant_entity_1.ChatParticipant)),
    __param(2, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __param(3, (0, typeorm_1.InjectRepository)(message_read_entity_1.MessageRead)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map