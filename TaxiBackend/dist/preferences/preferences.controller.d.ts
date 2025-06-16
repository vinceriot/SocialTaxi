import { PreferencesService } from './preferences.service';
export declare class PreferencesController {
    private readonly service;
    constructor(service: PreferencesService);
    findAll(): Promise<import("./preferences.entity").Preference[]>;
    assign(body: {
        orderId: string;
        preferenceIds: number[];
    }): Promise<import("./order-preferences.entity").OrderPreference[]>;
}
