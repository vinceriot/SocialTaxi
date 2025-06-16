import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('preferences')
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}