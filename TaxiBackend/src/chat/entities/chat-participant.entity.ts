// src/chat/entities/chat-participant.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { ChatConversation } from './chat-conversation.entity';
import { User } from '../../user/user.entity'; // путь: src/user/user.entity.ts

@Entity({ name: 'chat_participants' })
@Unique(['conversation', 'user'])
export class ChatParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ChatConversation,
    (conversation) => conversation.participants,
    { onDelete: 'CASCADE' },
  )
  conversation: ChatConversation;

  @ManyToOne(
    () => User,
    (user) => user.chatParticipants,
    { eager: true, onDelete: 'CASCADE' },
  )
  user: User;

  @Column({ length: 15 })
  role: 'user' | 'driver' | 'support';

  @CreateDateColumn({ type: 'timestamptz' })
  joinedAt: Date;
}