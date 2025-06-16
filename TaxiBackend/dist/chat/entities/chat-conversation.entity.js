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
exports.ChatConversation = void 0;
const typeorm_1 = require("typeorm");
const chat_participant_entity_1 = require("./chat-participant.entity");
const chat_message_entity_1 = require("./chat-message.entity");
let ChatConversation = class ChatConversation {
    id;
    type;
    status;
    createdAt;
    updatedAt;
    participants;
    messages;
};
exports.ChatConversation = ChatConversation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatConversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], ChatConversation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15, default: 'active' }),
    __metadata("design:type", String)
], ChatConversation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ChatConversation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ChatConversation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_participant_entity_1.ChatParticipant, (participant) => participant.conversation, { cascade: true }),
    __metadata("design:type", Array)
], ChatConversation.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_message_entity_1.ChatMessage, (message) => message.conversation, { cascade: true }),
    __metadata("design:type", Array)
], ChatConversation.prototype, "messages", void 0);
exports.ChatConversation = ChatConversation = __decorate([
    (0, typeorm_1.Entity)({ name: 'chat_conversations' })
], ChatConversation);
//# sourceMappingURL=chat-conversation.entity.js.map