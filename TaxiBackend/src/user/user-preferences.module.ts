import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreference } from './user-preferences.entity';
import { Preference } from '../preferences/preferences.entity';
import { User } from '../user/user.entity';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesController } from './user-preferences.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreference, Preference, User])],
  providers: [UserPreferencesService],
  controllers: [UserPreferencesController],
})
export class UserPreferencesModule {}