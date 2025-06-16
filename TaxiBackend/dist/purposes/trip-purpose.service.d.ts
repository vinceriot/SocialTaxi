import { Repository } from 'typeorm';
import { TripPurpose } from './trip-purpose.entity';
export declare class TripPurposeService {
    private readonly repo;
    constructor(repo: Repository<TripPurpose>);
    findAll(): Promise<TripPurpose[]>;
    create(name: string): Promise<TripPurpose>;
}
