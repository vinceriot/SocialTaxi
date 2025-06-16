import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { HttpModule } from '@nestjs/axios';
import { User } from '../user/user.entity';
import { Status } from '../status/status.entity';
import { OrderPreference } from '../preferences/order-preferences.entity';
import { Address } from '../address/address.entity';
import { Segment } from '../segments/segment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Status,
      OrderPreference,
      Address,
      Segment,
      User,
    ]),
    HttpModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}