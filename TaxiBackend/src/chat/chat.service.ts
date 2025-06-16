// src/chat/chat.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatConversation } from './entities/chat-conversation.entity';
import { ChatParticipant } from './entities/chat-participant.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { MessageRead } from './entities/message-read.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatConversation)
    private readonly convRepo: Repository<ChatConversation>,

    @InjectRepository(ChatParticipant)
    private readonly partRepo: Repository<ChatParticipant>,

    @InjectRepository(ChatMessage)
    private readonly msgRepo: Repository<ChatMessage>,

    @InjectRepository(MessageRead)
    private readonly readRepo: Repository<MessageRead>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 1) user ↔ driver
  async createUserDriverChat(userId: string, driverId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const driver = await this.userRepo.findOne({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');

    const conv = new ChatConversation();
    conv.type = 'user_driver';

    const partUser = new ChatParticipant();
    partUser.user = user;
    partUser.role = 'user';

    const partDriver = new ChatParticipant();
    partDriver.user = driver;
    partDriver.role = 'driver';

    conv.participants = [partUser, partDriver];
    return this.convRepo.save(conv);
  }

  // 2) user ↔ support
  async createUserSupportChat(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const conv = new ChatConversation();
    conv.type = 'user_support';

    const partUser = new ChatParticipant();
    partUser.user = user;
    partUser.role = 'user';

    conv.participants = [partUser];
    return this.convRepo.save(conv);
  }

  // 3) driver ↔ support
  async createDriverSupportChat(driverId: string) {
    const driver = await this.userRepo.findOne({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');

    const conv = new ChatConversation();
    conv.type = 'driver_support';

    const partDriver = new ChatParticipant();
    partDriver.user = driver;
    partDriver.role = 'driver';

    conv.participants = [partDriver];
    return this.convRepo.save(conv);
  }

  // 4) send message
  async sendMessage(
    senderId: string,
    conversationId: string,
    text: string,
  ) {
    const conv = await this.convRepo.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    const isInChat = conv.participants.some(p => p.user.id === senderId);
    if (!isInChat)
      throw new ForbiddenException('Sender is not in this conversation');

    const sender = await this.userRepo.findOne({
      where: { id: senderId },
    });
    if (!sender) throw new NotFoundException('Sender not found');

    const msg = new ChatMessage();
    msg.conversation = conv;
    msg.sender = sender;
    msg.text = text;
    return this.msgRepo.save(msg);
  }

  // 5) get messages
  async getMessages(
    conversationId: string,
    userId: string,
    since?: Date,
  ) {
    const conv = await this.convRepo.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    const isInChat = conv.participants.some(p => p.user.id === userId);
    if (!isInChat)
      throw new ForbiddenException('User is not in this conversation');

    const qb = this.msgRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.sender', 'sender')
      .where('m.conversationId = :cid', { cid: conversationId });

    if (since) {
      qb.andWhere('m.sentAt > :since', { since });
    }

    return qb.orderBy('m.sentAt', 'ASC').getMany();
  }

  // 6) mark as read
  async markAsRead(messageId: string, userId: string) {
    const msg = await this.msgRepo.findOne({
      where: { id: messageId },
      relations: ['conversation', 'conversation.participants'],
    });
    if (!msg) throw new NotFoundException('Message not found');

    const isInChat = msg.conversation.participants.some(
      p => p.user.id === userId,
    );
    if (!isInChat)
      throw new ForbiddenException('Not a participant');

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const already = await this.readRepo.findOne({
      where: {
        message: { id: messageId },
        user: { id: userId },
      },
    });
    if (already) return already;

    const read = new MessageRead();
    read.message = msg;
    read.user = user;
    return this.readRepo.save(read);
  }

  async getUserSupportChats(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.convRepo
      .createQueryBuilder('conv')
      .leftJoin('conv.participants', 'p')
      .where('conv.type = :type', { type: 'user_support' })
      .andWhere('p.user.id = :uid', { uid: userId })
      .getMany();
  }
}