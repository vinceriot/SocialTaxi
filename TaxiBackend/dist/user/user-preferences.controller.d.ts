import { UserPreferencesService } from './user-preferences.service';
export declare class UserPreferencesController {
    private readonly service;
    constructor(service: UserPreferencesService);
    getAll(req: any): Promise<import("./user-preferences.entity").UserPreference[]>;
    delete(preferenceId: number, req: any): Promise<import("typeorm").DeleteResult>;
    set(req: any, body: {
        preferenceIds: number[];
    }): Promise<{
        message: string;
    }>;
}
