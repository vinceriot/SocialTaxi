import { Controller, Post, Get, Body, Req, UseGuards, Param, Delete, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto } from './CreateUserAddressDto';

@Controller('user-addresses')
@UseGuards(JwtAuthGuard)
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  create(@Body() dto: CreateUserAddressDto, @Req() req) {
    return this.userAddressService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Req() req) {
    return this.userAddressService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAddressService.findOneById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.userAddressService.deleteByIdAndUser(id, req.user.id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateUserAddressDto, @Req() req) {
    return this.userAddressService.update(id, dto, req.user.id);
  }
}