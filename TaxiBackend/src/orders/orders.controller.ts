import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, HttpCode, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateOrderDto, @Req() req: RequestWithUser) {
    const order = await this.ordersService.create(dto, req.user.id);
    return { id: order.id };
    //return this.ordersService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.ordersService.findAll(req.user.id);
  }

 

  @Get('finished')
  getFinishedOrders(@Req() req: RequestWithUser) {
    return this.ordersService.getOrdersByStatuses(
      ['completed', 'cancelled'],
      req.user.id,
    );
  }


  @Get('active')
  getActiveOrders(@Req() req: RequestWithUser) {
    return this.ordersService.getActiveOrders(req.user.id);
  }

  @Get('calculate-price')
  async calculatePrice(
    @Query('startLat') startLat: string,
    @Query('startLng') startLng: string,
    @Query('endLat') endLat: string,
    @Query('endLng') endLng: string,
  ) {
    const start: [number, number] = [parseFloat(startLng), parseFloat(startLat)];
    const end: [number, number] = [parseFloat(endLng), parseFloat(endLat)];

    return await this.ordersService.calculateAllPrices(start, end);
  }

  @Put(':id/cancel')
  @HttpCode(200)
  async cancelOrder(@Param('id') id: string, @Req() req: RequestWithUser) {
  await this.ordersService.cancelOrder(id, req.user.id);
  return { success: true };
}

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.ordersService.findOne(id, req.user.id);
  }

  /* @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Req() req: RequestWithUser) {
    return this.ordersService.update(id, { ...updateOrderDto, userId: req.user.id });
  } */

  

  /* @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.ordersService.remove(id, req.user.id);
  }
 */

}