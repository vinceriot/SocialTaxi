import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('status')
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true})
  entityType: string;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
} 