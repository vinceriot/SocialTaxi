/* import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../entities/order.entity';
import { User } from '../../user/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Address } from '../../address/address.entity';
import { OrderStatusType } from './order-status-type.entity';


@Entity('order_legs')
export class OrderLeg {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.legs)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'from_address_id' })
  fromAddress: Address;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'to_address_id' })
  toAddress: Address;

  @Column()
  departureTime: Date;

  @Column()
  arrivalTime: Date;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => OrderStatusType)
  @JoinColumn({ name: 'status_id' })
  status: OrderStatusType;
} */