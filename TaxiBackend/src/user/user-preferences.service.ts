import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './user-preferences.entity';
import { User } from './user.entity';
import { Preference } from '../preferences/preferences.entity';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepo: Repository<UserPreference>,
    @InjectRepository(Preference)
    private readonly preferenceRepo: Repository<Preference>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getAllForUser(userId: string) {
    return this.userPreferenceRepo.find({
      where: { user: { id: userId } },
      relations: ['preference'],
    });
  }

  async deletePreference(userId: string, preferenceId: number) {
    return this.userPreferenceRepo.delete({
      user: { id: userId },
      preference: { id: preferenceId },
    });
  }

  async setPreferences(userId: string, preferenceIds: number[]) {
    const user = await this.userRepo.findOneByOrFail({ id: userId });

    // Очистить старые предпочтения
    await this.userPreferenceRepo.delete({ user: { id: userId } });

    // Загрузить объекты предпочтений
    const preferences = await this.preferenceRepo.findByIds(preferenceIds);

    // Создать и сохранить новые связи
    const entries = preferences.map(pref =>
      this.userPreferenceRepo.create({ user, preference: pref }),
    );

    return this.userPreferenceRepo.save(entries);
  }
}