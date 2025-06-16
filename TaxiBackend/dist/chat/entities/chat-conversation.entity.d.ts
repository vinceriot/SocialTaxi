import { ChatParticipant } from './chat-participant.entity';
import { ChatMessage } from './chat-message.entity';
export declare class ChatConversation {
    id: string;
    type: 'user_driver' | 'user_support' | 'driver_support';
    status: 'active' | 'closed';
    createdAt: Date;
    updatedAt: Date;
    participants: ChatParticipant[];
    messages: ChatMessage[];
}
