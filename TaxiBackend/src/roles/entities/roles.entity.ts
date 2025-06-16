import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToMany } from 'typeorm';
import { User } from '../../user/user.entity';
@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}