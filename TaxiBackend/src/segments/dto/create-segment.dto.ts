import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateSegmentDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  driverId: string;

  @IsUUID()
  vehicleId: string;

  @IsUUID()
  fromAddressId: string;

  @IsUUID()
  toAddressId: string;

  @IsUUID()
  statusId: string;

  @IsDateString()
  departureTime: string;

  @IsDateString()
  arrivalTime: string;

  @IsOptional()
  @IsString()
  comment?: string;
}