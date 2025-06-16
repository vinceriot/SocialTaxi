import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripPurpose } from './trip-purpose.entity';
import { TripPurposeService } from './trip-purpose.service';
import { TripPurposeController } from './trip-purpose.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TripPurpose])],
  providers: [TripPurposeService],
  controllers: [TripPurposeController],
  exports: [TripPurposeService],
})
export class TripPurposeModule {}