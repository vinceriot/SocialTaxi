// order-status.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class OrderStatus {
  @PrimaryGeneratedColumn()
  statusId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}