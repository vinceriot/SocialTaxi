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
exports.ChatParticipant = void 0;
const typeorm_1 = require("typeorm");
const chat_conversation_entity_1 = require("./chat-conversation.entity");
const user_entity_1 = require("../../user/user.entity");
let ChatParticipant = class ChatParticipant {
    id;
    conversation;
    user;
    role;
    joinedAt;
};
exports.ChatParticipant = ChatParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_conversation_entity_1.ChatConversation, (conversation) => conversation.participants, { onDelete: 'CASCADE' }),
    __metadata("design:type", chat_conversation_entity_1.ChatConversation)
], ChatParticipant.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.chatParticipants, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], ChatParticipant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15 }),
    __metadata("design:type", String)
], ChatParticipant.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ChatParticipant.prototype, "joinedAt", void 0);
exports.ChatParticipant = ChatParticipant = __decorate([
    (0, typeorm_1.Entity)({ name: 'chat_participants' }),
    (0, typeorm_1.Unique)(['conversation', 'user'])
], ChatParticipant);
//# sourceMappingURL=chat-participant.entity.js.map