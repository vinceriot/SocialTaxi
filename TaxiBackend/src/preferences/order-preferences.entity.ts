import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Preference } from './preferences.entity';

@Entity('order_preferences')
export class OrderPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.preferences)
  order: Order;

  @ManyToOne(() => Preference)
  preference: Preference;
}