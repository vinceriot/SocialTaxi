import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { SegmentsController } from './segments.controller';
import { SegmentsService } from './segments.service';
import { Segment } from './segment.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../user/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Address } from '../address/address.entity';
import { Status } from '../status/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Segment, Order, User, Vehicle, Address, Status])],
  providers: [SegmentsService],
})
export class SegmentsModule {}