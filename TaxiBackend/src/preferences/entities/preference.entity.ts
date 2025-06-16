import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Preference {
  @PrimaryGeneratedColumn()
  preferenceId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}