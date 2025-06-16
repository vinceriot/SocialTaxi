import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { JwtService } from '@nestjs/jwt';
export declare class ChatGateway implements OnGatewayConnection {
    private readonly chatService;
    private readonly jwtService;
    constructor(chatService: ChatService, jwtService: JwtService);
    server: Server;
    handleConnection(client: Socket): Promise<void>;
    handleJoinChat(conversationId: string, client: Socket): void;
    handleSendMessage(payload: {
        conversationId: string;
        text: string;
    }, client: Socket): Promise<void>;
}
