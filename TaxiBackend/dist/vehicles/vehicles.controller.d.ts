import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(dto: CreateVehicleDto): Promise<import("./vehicle.entity").Vehicle>;
    findAll(): Promise<import("./vehicle.entity").Vehicle[]>;
    findOne(id: string): Promise<import("./vehicle.entity").Vehicle>;
    update(id: string, dto: UpdateVehicleDto): Promise<import("./vehicle.entity").Vehicle>;
    remove(id: string): Promise<void>;
}
