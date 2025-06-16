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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const typeorm_1 = require("typeorm");
const chat_conversation_entity_1 = require("./chat-conversation.entity");
const user_entity_1 = require("../../user/user.entity");
const message_read_entity_1 = require("./message-read.entity");
let ChatMessage = class ChatMessage {
    id;
    conversation;
    sender;
    text;
    sentAt;
    reads;
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_conversation_entity_1.ChatConversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' }),
    __metadata("design:type", chat_conversation_entity_1.ChatConversation)
], ChatMessage.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.sentMessages, { eager: true, onDelete: 'SET NULL' }),
    __metadata("design:type", user_entity_1.User)
], ChatMessage.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ChatMessage.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ChatMessage.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_read_entity_1.MessageRead, (read) => read.message, { cascade: true }),
    __metadata("design:type", Array)
], ChatMessage.prototype, "reads", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, typeorm_1.Entity)({ name: 'chat_messages' })
], ChatMessage);
//# sourceMappingURL=chat-message.entity.js.map