// src/chat/chat.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Get,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';

class SendMessageDto {
  conversationId: string; // UUID беседы
  text: string;
}

class GetMessagesQuery {
  since?: string; // ISO-строка, например "2025-06-01T11:05:30.000Z"
}

class MarkReadDto {
  messageId: string; // UUID сообщения
}

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 1) Создать чат «user ↔ driver»
  @Post('user-driver')
  createUserDriver(
    @UserId() userId: string,
    @Body() dto: { driverId: string },
  ) {
    return this.chatService.createUserDriverChat(userId, dto.driverId);
  }

  // 2) Создать чат «user ↔ support»
  @Post('user-support')
  createUserSupport(@UserId() userId: string) {
    return this.chatService.createUserSupportChat(userId);
  }

  // 3) Создать чат «driver ↔ support»
  @Post('driver-support')
  createDriverSupport(@UserId() driverId: string) {
    return this.chatService.createDriverSupportChat(driverId);
  }

  // → НОВЫЕ МАРШРУТЫ ДЛЯ СООБЩЕНИЙ:

  // 4) Отправить сообщение (senderId берётся из JWT)
  @Post('message')
  sendMessage(
    @UserId() senderId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(senderId, dto.conversationId, dto.text);
  }

  // 5) Получить историю сообщений (с опциональным фильтром since)
  @Get(':id/messages')
  getMessages(
    @UserId() userId: string,
    @Param('id', ParseUUIDPipe) conversationId: string,
    @Query() query: GetMessagesQuery,
  ) {
    const since = query.since ? new Date(query.since) : undefined;
    return this.chatService.getMessages(conversationId, userId, since);
  }

  // 6) Пометить сообщение как «прочитанное» (userId берётся из JWT)
  @Post('read')
  markRead(
    @UserId() userId: string,
    @Body() dto: MarkReadDto,
  ) {
    return this.chatService.markAsRead(dto.messageId, userId);
  }

  @Get('support')
  getUserSupportChats(@UserId() userId: string) {
    return this.chatService.getUserSupportChats(userId);
  }
}