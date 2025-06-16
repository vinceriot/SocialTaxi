// src/chat/entities/message-read.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { User } from '../../user/user.entity';

@Entity({ name: 'message_reads' })
@Unique(['message', 'user'])
export class MessageRead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ChatMessage,
    (message) => message.reads,
    { onDelete: 'CASCADE' },
  )
  message: ChatMessage;

  @ManyToOne(
    () => User,
    (user) => user.readMessages,
    { eager: true, onDelete: 'CASCADE' },
  )
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  readAt: Date;
}