import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import {
  IsString,
  Length,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsDate,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Role } from '../roles/entities/roles.entity';
import { Session } from '../auth/entities/session.entity';
import { Order } from '../orders/entities/order.entity';
import { UserAddress } from '../address/user-address.entity';
import { ChatParticipant } from '../chat/entities/chat-participant.entity';
import { ChatMessage } from '../chat/entities/chat-message.entity';
import { MessageRead } from '../chat/entities/message-read.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @Length(1, 50)
  firstName: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  lastName: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  surname: string;

  @Column({ unique: true })
  @IsPhoneNumber('RU')
  phoneNumber: string;

  @Column({ nullable: true, unique: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @Column({ select: false })
  @IsString()
  passwordHash: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  driverLicense: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDate()
  driverLicenseIssuedAt: Date;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDate()
  driverLicenseExpiresAt: Date;

  @Column({ type: 'float', default: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'users_role',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'roleId',
    },
  })
  roles: Role[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
  
  @OneToMany(() => Order, order => order.user)
  orders: Order[];
  
  @OneToMany(() => UserAddress, userAddress => userAddress.user)
  addresses: UserAddress[];

  @OneToMany(() => ChatParticipant, (participant) => participant.user)
  chatParticipants: ChatParticipant[];

  @OneToMany(() => ChatMessage, (message) => message.sender)
  sentMessages: ChatMessage[];

  @OneToMany(() => MessageRead, (read) => read. user)
  readMessages: MessageRead[];
}