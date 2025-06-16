import { Order } from '../orders/entities/order.entity';
import { Preference } from './preferences.entity';
export declare class OrderPreference {
    id: number;
    order: Order;
    preference: Preference;
}
