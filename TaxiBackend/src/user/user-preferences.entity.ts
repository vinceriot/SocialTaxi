import {
  Entity, PrimaryGeneratedColumn, ManyToOne
} from 'typeorm';
import { User } from './user.entity';
import { Preference } from '../preferences/preferences.entity';

@Entity()
export class UserPreference {
  @PrimaryGeneratedColumn()
  userPreferenceId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Preference, { eager: true })
  preference: Preference;
}