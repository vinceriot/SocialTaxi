import { Repository } from 'typeorm';
import { ChatConversation } from './entities/chat-conversation.entity';
import { ChatParticipant } from './entities/chat-participant.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { MessageRead } from './entities/message-read.entity';
import { User } from '../user/user.entity';
export declare class ChatService {
    private readonly convRepo;
    private readonly partRepo;
    private readonly msgRepo;
    private readonly readRepo;
    private readonly userRepo;
    constructor(convRepo: Repository<ChatConversation>, partRepo: Repository<ChatParticipant>, msgRepo: Repository<ChatMessage>, readRepo: Repository<MessageRead>, userRepo: Repository<User>);
    createUserDriverChat(userId: string, driverId: string): Promise<ChatConversation>;
    createUserSupportChat(userId: string): Promise<ChatConversation>;
    createDriverSupportChat(driverId: string): Promise<ChatConversation>;
    sendMessage(senderId: string, conversationId: string, text: string): Promise<ChatMessage>;
    getMessages(conversationId: string, userId: string, since?: Date): Promise<ChatMessage[]>;
    markAsRead(messageId: string, userId: string): Promise<MessageRead>;
    getUserSupportChats(userId: string): Promise<ChatConversation[]>;
}
