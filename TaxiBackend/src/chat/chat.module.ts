// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatConversation } from './entities/chat-conversation.entity';
import { ChatParticipant } from './entities/chat-participant.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { MessageRead } from './entities/message-read.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { User } from '../user/user.entity'; // путь: src/user/user.entity.ts

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatConversation,
      ChatParticipant,
      ChatMessage,
      MessageRead,
      User,
    ]),
  ],
  providers: [ChatService],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}