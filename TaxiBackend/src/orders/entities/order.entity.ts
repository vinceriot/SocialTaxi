import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn
} from 'typeorm';
import { User } from '../../user/user.entity';
import { Status } from '../../status/status.entity';
import { TripPurpose } from '../../purposes/trip-purpose.entity';
import { OrderPreference } from '../../preferences/order-preferences.entity';
import { Segment } from '../../segments/segment.entity';


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User)
  dispatcher: User;

  @ManyToOne(() => Status)
  status: Status;

  @Column({ type: 'text', nullable: false})
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TripPurpose)
  purpose: TripPurpose;

  @Column({ nullable: true }) // 👈 временно
  vehicleType: string;

  @OneToMany(() => OrderPreference, (pref) => pref.order)
  preferences: OrderPreference[];

  @OneToMany(() => Segment, segment => segment.order)
  segments: Segment[];
}