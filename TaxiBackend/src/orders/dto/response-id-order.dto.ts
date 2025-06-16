import { Expose, Type } from 'class-transformer';
import { SegmentDto } from '../../segments/dto/segment.dto';
import { VehicleDto } from '../../vehicles/dto/response-vehicle.dto';
import { DriverDto} from '../../user/dto/driver.dto';

export class OrderDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  comment: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  status: {
    code: string;
    name: string;
  } | null;

  @Expose()
  @Type(() => SegmentDto)
  segments: SegmentDto[];


  @Expose()
  returnTime?: Date;

  @Expose()
  @Type(() => VehicleDto)
    vehicle: VehicleDto;

  @Expose()
  @Type(() => DriverDto)
  user: DriverDto;
}