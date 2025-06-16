import { ChatService } from './chat.service';
declare class SendMessageDto {
    conversationId: string;
    text: string;
}
declare class GetMessagesQuery {
    since?: string;
}
declare class MarkReadDto {
    messageId: string;
}
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createUserDriver(userId: string, dto: {
        driverId: string;
    }): Promise<import("./entities/chat-conversation.entity").ChatConversation>;
    createUserSupport(userId: string): Promise<import("./entities/chat-conversation.entity").ChatConversation>;
    createDriverSupport(driverId: string): Promise<import("./entities/chat-conversation.entity").ChatConversation>;
    sendMessage(senderId: string, dto: SendMessageDto): Promise<import("./entities/chat-message.entity").ChatMessage>;
    getMessages(userId: string, conversationId: string, query: GetMessagesQuery): Promise<import("./entities/chat-message.entity").ChatMessage[]>;
    markRead(userId: string, dto: MarkReadDto): Promise<import("./entities/message-read.entity").MessageRead>;
    getUserSupportChats(userId: string): Promise<import("./entities/chat-conversation.entity").ChatConversation[]>;
}
export {};
