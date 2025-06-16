import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  vehicleId: number;

  @Column()
  brand: string; // Марка автомобиля

  @Column()
  model: string; // Модель автомобиля

  @Column()
  licensePlate: string; // Номерной знак

  @Column({ type: 'text', nullable: true })
  specialEquipment: string; // Специальное оборудование (например, подъёмник, крепление для кресла и т.д.)

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}