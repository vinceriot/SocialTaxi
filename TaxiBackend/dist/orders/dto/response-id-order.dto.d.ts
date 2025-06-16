import { SegmentDto } from '../../segments/dto/segment.dto';
import { VehicleDto } from '../../vehicles/dto/response-vehicle.dto';
import { DriverDto } from '../../user/dto/driver.dto';
export declare class OrderDetailResponseDto {
    id: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    status: {
        code: string;
        name: string;
    } | null;
    segments: SegmentDto[];
    returnTime?: Date;
    vehicle: VehicleDto;
    user: DriverDto;
}
