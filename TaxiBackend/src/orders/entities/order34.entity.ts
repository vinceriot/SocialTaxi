/* // order.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { OrderLeg } from './entities/order-leg.entity';
import { OrderStatusType } from './entities/order-status-type.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Пользователь, оформивший заказ
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'dispatcher_id' })
  dispatcher: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'text', nullable: true })
  comment: string;
  
  @Column({ nullable: true }) // 👈 временно
  vehicleType: string;

  @ManyToOne(() => OrderStatusType)
  @JoinColumn({ name: 'status_id' })
  status: OrderStatusType;

  @OneToMany(() => OrderLeg, leg => leg.order)
  legs: OrderLeg[];
} */