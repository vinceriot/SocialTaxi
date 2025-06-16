import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne
} from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../user/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Address } from '../address/address.entity';
import { Status } from '../status/status.entity';

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => User)
  driver: User;

  @ManyToOne(() => Vehicle)
  vehicle: Vehicle;

  @ManyToOne(() => Address)
  fromAddress: Address;

  @ManyToOne(() => Address)
  toAddress: Address;

  @ManyToOne(() => Status)
  status: Status;

  @Column({ type: 'timestamptz' })
  departureTime: Date;

  @Column({ type: 'timestamptz', nullable: true })
  arrivalTime: Date;

  @Column({ type: 'text', nullable: true })
  comment: string;

}