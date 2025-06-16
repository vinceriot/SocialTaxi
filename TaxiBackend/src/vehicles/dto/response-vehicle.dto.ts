import { Expose } from 'class-transformer';

export class VehicleDto {
  @Expose()
  id: string;

  @Expose()
  brand: string;

  @Expose()
  model: string;

  @Expose()
  licensePlate: string;

  @Expose()
  color?: string;

  @Expose()
  year?: number;

  @Expose()
  wheelchairAccessible: boolean;
}