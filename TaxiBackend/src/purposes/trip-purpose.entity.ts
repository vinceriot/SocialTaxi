import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('trip_purposes')
export class TripPurpose {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}