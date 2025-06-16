import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ChatParticipant } from './chat-participant.entity';
import { ChatMessage } from './chat-message.entity';

@Entity({ name: 'chat_conversations' })
export class ChatConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  type: 'user_driver' | 'user_support' | 'driver_support';

  @Column({ length: 15, default: 'active' })
  status: 'active' | 'closed';

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(
    () => ChatParticipant,
    (participant) => participant.conversation,
    { cascade: true },
  )
  participants: ChatParticipant[];

  @OneToMany(
    () => ChatMessage,
    (message) => message.conversation,
    { cascade: true },
  )
  messages: ChatMessage[];
}