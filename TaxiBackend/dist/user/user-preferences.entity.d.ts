import { User } from './user.entity';
import { Preference } from '../preferences/preferences.entity';
export declare class UserPreference {
    userPreferenceId: number;
    user: User;
    preference: Preference;
}
