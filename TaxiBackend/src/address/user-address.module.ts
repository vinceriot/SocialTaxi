import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';
import { UserAddress } from './user-address.entity';
import { Address } from './address.entity';
import { User } from '../user/user.entity'; // Добавьте этот импорт

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAddress, Address, User]), // Добавьте User сюда
  ],
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {}