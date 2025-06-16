import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  licensePlate: string;

  @IsOptional()
  @IsString()
  specialEquipment?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}