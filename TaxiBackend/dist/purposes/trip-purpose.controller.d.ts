import { TripPurposeService } from './trip-purpose.service';
export declare class TripPurposeController {
    private readonly service;
    constructor(service: TripPurposeService);
    findAll(): Promise<import("./trip-purpose.entity").TripPurpose[]>;
    create(name: string): Promise<import("./trip-purpose.entity").TripPurpose>;
}
