import { ChatConversation } from './chat-conversation.entity';
import { User } from '../../user/user.entity';
import { MessageRead } from './message-read.entity';
export declare class ChatMessage {
    id: string;
    conversation: ChatConversation;
    sender: User;
    text: string;
    sentAt: Date;
    reads: MessageRead[];
}
