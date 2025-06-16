// src/chat/entities/chat-message.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ChatConversation } from './chat-conversation.entity';
import { User } from '../../user/user.entity';
import { MessageRead } from './message-read.entity';

@Entity({ name: 'chat_messages' })
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ChatConversation,
    (conversation) => conversation.messages,
    { onDelete: 'CASCADE' },
  )
  conversation: ChatConversation;

  @ManyToOne(
    () => User,
    (user) => user.sentMessages,
    { eager: true, onDelete: 'SET NULL' },
  )
  sender: User;

  @Column('text')
  text: string;

  @CreateDateColumn({ type: 'timestamptz' })
  sentAt: Date;

  @OneToMany(
    () => MessageRead,
    (read) => read.message,
    { cascade: true },
  )
  reads: MessageRead[];
}