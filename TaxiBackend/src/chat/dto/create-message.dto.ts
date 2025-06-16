// src/chat/dto/create-message.dto.ts
import { IsUUID, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  conversationId: string;

  @IsUUID()
  senderId: string;

  @IsString()
  text: string;
}