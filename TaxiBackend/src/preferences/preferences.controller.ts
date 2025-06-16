import { Controller, Get, Post, Body } from '@nestjs/common';
import { PreferencesService } from './preferences.service';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly service: PreferencesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post('assign')
  assign(@Body() body: { orderId: string; preferenceIds: number[] }) {
    return this.service.assignToOrder({ id: body.orderId } as any, body.preferenceIds);
  }
}