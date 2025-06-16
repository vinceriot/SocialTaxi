// src/gateways/order.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/ws', cors: true })
export class OrderGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('order:subscribe')
  handleOrderSubscribe(@MessageBody() orderId: string, @ConnectedSocket() client: Socket) {
    client.join(`order:${orderId}`);
  }

  updateOrderStatus(orderId: string, status: string) {
    this.server.to(`order:${orderId}`).emit('order:update', { status });
  }
}