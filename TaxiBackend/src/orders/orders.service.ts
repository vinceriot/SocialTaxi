import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Order } from '../orders/entities/order.entity';
import { User } from '../user/user.entity';
import { Status } from '../status/status.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderPreference } from '../preferences/order-preferences.entity';
import { Address } from '../address/address.entity';
import { Segment } from '../segments/segment.entity';
import { OrderResponseDto } from './dto/response-order.dto';
import { In, Not } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, min } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(OrderPreference)
    private readonly orderPreferenceRepository: Repository<OrderPreference>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Segment)
    private readonly segmentRepository: Repository<Segment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

    async create(dto: CreateOrderDto, userId: string): Promise<Order> {
    const order = new Order();
    order.user = await this.userRepository.findOneByOrFail({ id: userId });
    order.comment = dto.comment ?? '';
    order.vehicleType = dto.vehicleType;
    order.purpose = { id: dto.purposeId } as any;
    order.status = await this.statusRepository.findOneByOrFail({ code: 'waiting_assignment' });

    const savedOrder = await this.orderRepository.save(order);

    // 1. Предпочтения
    if (dto.preferenceIds?.length) {
      const preferences = dto.preferenceIds.map((id) =>
        this.orderPreferenceRepository.create({
          order: savedOrder,
          preference: { id } as any,
        }),
      );
      await this.orderPreferenceRepository.save(preferences);
    }

    // 2. Адреса и сегменты
    for (const seg of dto.segments) {
      const from = await this.addressRepository.save(this.addressRepository.create(seg.fromAddress));
      const to = await this.addressRepository.save(this.addressRepository.create(seg.toAddress));

      const segment = this.segmentRepository.create({
        order: savedOrder,
        fromAddress: from,
        toAddress: to,
        departureTime: new Date(seg.departureTime),
        status: await this.statusRepository.findOneByOrFail({ code: 'waiting_assignment' }),
      });

      await this.segmentRepository.save(segment);
    }

    return savedOrder;
  }

    async findAll(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: [
        'status',
        'segments',
        'segments.status',
        'segments.fromAddress',
        'segments.toAddress',
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    return plainToInstance(OrderResponseDto, orders, {
      excludeExtraneousValues: true,
    });
  }

    async findOne(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'status',
        'segments',
        'segments.status',
        'segments.vehicle',
        'segments.driver',
        'segments.fromAddress',
        'segments.toAddress',
        'preferences',
        'user',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    if (order.user.id !== userId) {
      throw new ForbiddenException('Нет доступа к этому заказу');
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id, dto.userId);
    order.comment = dto.comment ?? order.comment;
    return this.orderRepository.save(order);
  }

  async cancelOrder(id: string, userId: string): Promise<void> {
    // Получаем заказ только с нужными связями: user и segments
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'segments'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to cancel this order');
    }

    const cancelledStatus = await this.statusRepository.findOneByOrFail({ code: 'cancelled' });

    order.status = cancelledStatus;
    await this.orderRepository.save(order);

    if (order.segments && order.segments.length) {
      for (const segment of order.segments) {
        segment.status = cancelledStatus;
        await this.segmentRepository.save(segment);
      }
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const order = await this.findOne(id, userId);
    await this.orderRepository.remove(order);
  }



    async getOrdersByStatuses(statusCodes: string[], userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: {
        user: { id: userId },
        status: { code: In(statusCodes) },
      },
      relations: [
        'status',
        'segments',
        'segments.status',
        'segments.fromAddress',
        'segments.toAddress',
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    return plainToInstance(OrderResponseDto, orders, {
      excludeExtraneousValues: true,
    });
  }


  async getActiveOrders(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: {
        user: { id: userId },
        status: { code: Not(In(['completed', 'cancelled'])) },
      },
      relations: [
        'status',
        'segments',
        'segments.status',
        'segments.fromAddress',
        'segments.toAddress',
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    return plainToInstance(OrderResponseDto, orders, {
      excludeExtraneousValues: true,
    });
  }

  async calculateRouteCost(
    start: [number, number],
    end: [number, number],
    vehicleType: 'car' | 'minivan',
  ): Promise<number> {
    const apiKey = this.configService.get<string>('ORS_API_KEY');
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`;

    const response = await lastValueFrom(this.httpService.get<any>(url));
    const distance = response.data?.features?.[0]?.properties?.segments?.[0]?.distance;

    if (!distance) throw new Error('Не удалось получить расстояние маршрута');

    const distanceInKm = distance / 1000;

    const tariffs = {
      car: { base: 100, perKm: 20 },
      minivan: { base: 150, perKm: 35 },
    };

    const { base, perKm } = tariffs[vehicleType];
    const total = base + distanceInKm * perKm;

    return Math.round(total);
  }

  async calculateAllPrices(start: [number, number], end: [number, number]) {
    const [car, minivan] = await Promise.all([
      this.calculateRouteCost(start, end, 'car'),
      this.calculateRouteCost(start, end, 'minivan'),
    ]);

    const discountRate = 0.3; // пользователь платит 30%

    return {
      standard: {
        full: car,
        discounted: Math.round(car * discountRate),
      },
      special: {
        full: minivan,
        discounted: Math.round(minivan * discountRate),
      },
    };
  }
}