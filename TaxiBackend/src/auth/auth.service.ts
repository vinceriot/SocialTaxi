// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Session } from './entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: { phoneNumber: string; password: string }) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.phoneNumber = :phoneNumber', {
        phoneNumber: dto.phoneNumber,
      })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Неверный телефон или пароль');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Неверный телефон или пароль');
    }

    // Генерация JWT
    const payload = { sub: user.id, roles: user.roles || [] };
    const token = this.jwtService.sign(payload);

    // Сохраняем сессию(опционально)
    const session = this.sessionRepo.create({ token, user });
    await this.sessionRepo.save(session);

    return { access_token: token };
  }

  async logout(token: string) {
    // Удаляем сессию
    await this.sessionRepo.delete({ token });
    return { success: true };
  }
}