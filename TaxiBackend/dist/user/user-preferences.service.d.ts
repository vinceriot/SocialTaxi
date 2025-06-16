import { Repository } from 'typeorm';
import { UserPreference } from './user-preferences.entity';
import { User } from './user.entity';
import { Preference } from '../preferences/preferences.entity';
export declare class UserPreferencesService {
    private readonly userPreferenceRepo;
    private readonly preferenceRepo;
    private readonly userRepo;
    constructor(userPreferenceRepo: Repository<UserPreference>, preferenceRepo: Repository<Preference>, userRepo: Repository<User>);
    getAllForUser(userId: string): Promise<UserPreference[]>;
    deletePreference(userId: string, preferenceId: number): Promise<import("typeorm").DeleteResult>;
    setPreferences(userId: string, preferenceIds: number[]): Promise<UserPreference[]>;
}
