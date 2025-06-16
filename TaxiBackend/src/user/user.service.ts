import {User} from './user.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
  if (!dto.password || dto.password.trim() === '') {
    throw new Error('Пароль обязателен');
  }

  const user = this.userRepo.create({
    ...dto,
    passwordHash: await bcrypt.hash(dto.password, 10),
  });

  return this.userRepo.save(user);
}

  findAll() {
    return this.userRepo.find({ relations: ['roles'] });
  }
  async findById(id: string) {
    return this.userRepo.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'phoneNumber', 'email', 'rating'],
    });
  }
}