import { ChatMessage } from './chat-message.entity';
import { User } from '../../user/user.entity';
export declare class MessageRead {
    id: string;
    message: ChatMessage;
    user: User;
    readAt: Date;
}
