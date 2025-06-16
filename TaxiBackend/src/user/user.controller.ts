import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // если у тебя уже есть guard
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: number };
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    const userId = String(req.user.id);
    return this.userService.findById(userId);
  }
}