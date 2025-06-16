// src/gateways/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: '/ws', cors: true })
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    console.log('📡 Новый клиент подключился:', client.id);
    console.log('🔐 Полученный токен:', token);
    if (!token) {
      console.warn('🚫 Нет токена!');
      client.disconnect();
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = { id: payload.sub, roles: payload.roles || [] };
      console.log('✅ Пользователь подключён:', client.data.user.id);
    } catch (err) {
      console.warn('🚫 Невалидный токен!');
      client.disconnect();
    }
  }

  @SubscribeMessage('chat:join')
  handleJoinChat(
  @MessageBody() conversationId: string,
  @ConnectedSocket() client: Socket,
) {
  client.join(`chat:${conversationId}`);
  console.log(`👥 Пользователь ${client.data.user.id} подписался на комнату chat:${conversationId}`);
}

  @SubscribeMessage('chat:send')
  async handleSendMessage(
    @MessageBody() payload: { conversationId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user) return;

    const saved = await this.chatService.sendMessage(
      user.id,
      payload.conversationId,
      payload.text,
    );

    this.server.to(`chat:${payload.conversationId}`).emit('chat:message', {
      id: saved.id,
      from: saved.sender.id,
      text: saved.text,
      timestamp: saved.sentAt,
    });
  }
}