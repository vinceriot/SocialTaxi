import { Expose, Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AddressDto {
  @Expose()
  @IsString()
  fullAddress: string;

  @Expose()
  @IsNumber()
  latitude: number;

  @Expose()
  @IsNumber()
  longitude: number;

  @Expose()
  @IsString()
  country: string;

  @Expose()
  @IsString()
  region: string;

  @Expose()
  @IsString()
  city: string;

  @Expose()
  @IsString()
  street: string;

  @Expose()
  @IsString()
  house: string;

  @Expose()
  @IsString()
  @IsOptional()
  apartment?: string;

  @Expose()
  @IsString()
  @IsOptional()
  postalCode?: string;
}