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
exports.MessageRead = void 0;
const typeorm_1 = require("typeorm");
const chat_message_entity_1 = require("./chat-message.entity");
const user_entity_1 = require("../../user/user.entity");
let MessageRead = class MessageRead {
    id;
    message;
    user;
    readAt;
};
exports.MessageRead = MessageRead;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MessageRead.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_message_entity_1.ChatMessage, (message) => message.reads, { onDelete: 'CASCADE' }),
    __metadata("design:type", chat_message_entity_1.ChatMessage)
], MessageRead.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.readMessages, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], MessageRead.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], MessageRead.prototype, "readAt", void 0);
exports.MessageRead = MessageRead = __decorate([
    (0, typeorm_1.Entity)({ name: 'message_reads' }),
    (0, typeorm_1.Unique)(['message', 'user'])
], MessageRead);
//# sourceMappingURL=message-read.entity.js.map