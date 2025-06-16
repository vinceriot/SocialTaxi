import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn
} from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 9, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 9, scale: 6 })
  longitude: number;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  house: string;

  @Column({ nullable: true })
  apartment: string;

  @Column({ nullable: true })
  entrance: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'text' })
  fullAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}