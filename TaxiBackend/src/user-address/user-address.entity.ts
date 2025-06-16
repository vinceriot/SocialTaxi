import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn
} from 'typeorm';
import { User } from '../user/user.entity';
import { Address } from '../address/address.entity';

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Address)
  address: Address;

  @Column()
  label: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;
}