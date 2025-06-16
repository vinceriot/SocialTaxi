// src/chat/dto/mark-read.dto.ts
import { IsUUID } from 'class-validator';

export class MarkReadDto {
  @IsUUID()
  messageId: string; 

  @IsUUID()
  userId: string; 
}