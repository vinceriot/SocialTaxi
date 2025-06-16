import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preference } from './preferences.entity';
import { OrderPreference } from './order-preferences.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(Preference)
    private readonly prefRepo: Repository<Preference>,
    @InjectRepository(OrderPreference)
    private readonly orderPrefRepo: Repository<OrderPreference>,
  ) {}

  findAll(): Promise<Preference[]> {
    return this.prefRepo.find();
  }

  async assignToOrder(order: Order, preferenceIds: number[]) {
    const prefs = preferenceIds.map((id) =>
      this.orderPrefRepo.create({ order, preference: { id } as any }),
    );
    return this.orderPrefRepo.save(prefs);
  }
}