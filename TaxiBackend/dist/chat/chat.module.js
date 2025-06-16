"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_conversation_entity_1 = require("./entities/chat-conversation.entity");
const chat_participant_entity_1 = require("./entities/chat-participant.entity");
const chat_message_entity_1 = require("./entities/chat-message.entity");
const message_read_entity_1 = require("./entities/message-read.entity");
const chat_service_1 = require("./chat.service");
const chat_controller_1 = require("./chat.controller");
const user_entity_1 = require("../user/user.entity");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                chat_conversation_entity_1.ChatConversation,
                chat_participant_entity_1.ChatParticipant,
                chat_message_entity_1.ChatMessage,
                message_read_entity_1.MessageRead,
                user_entity_1.User,
            ]),
        ],
        providers: [chat_service_1.ChatService],
        exports: [chat_service_1.ChatService],
        controllers: [chat_controller_1.ChatController],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map