import { Controller, Get, Post, Body } from '@nestjs/common';
import { TripPurposeService } from './trip-purpose.service';

@Controller('trip-purposes')
export class TripPurposeController {
  constructor(private readonly service: TripPurposeService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.service.create(name);
  }
}