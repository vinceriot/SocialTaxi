import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesService {
    private readonly vehicleRepo;
    constructor(vehicleRepo: Repository<Vehicle>);
    create(dto: CreateVehicleDto): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
    findOne(id: string): Promise<Vehicle>;
    update(id: string, dto: UpdateVehicleDto): Promise<Vehicle>;
    remove(id: string): Promise<void>;
}
