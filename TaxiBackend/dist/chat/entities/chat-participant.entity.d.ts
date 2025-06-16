import { ChatConversation } from './chat-conversation.entity';
import { User } from '../../user/user.entity';
export declare class ChatParticipant {
    id: string;
    conversation: ChatConversation;
    user: User;
    role: 'user' | 'driver' | 'support';
    joinedAt: Date;
}
