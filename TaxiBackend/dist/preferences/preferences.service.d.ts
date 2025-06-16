import { Repository } from 'typeorm';
import { Preference } from './preferences.entity';
import { OrderPreference } from './order-preferences.entity';
import { Order } from '../orders/entities/order.entity';
export declare class PreferencesService {
    private readonly prefRepo;
    private readonly orderPrefRepo;
    constructor(prefRepo: Repository<Preference>, orderPrefRepo: Repository<OrderPreference>);
    findAll(): Promise<Preference[]>;
    assignToOrder(order: Order, preferenceIds: number[]): Promise<OrderPreference[]>;
}
