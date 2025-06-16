import {
  IsOptional, IsString,
  IsArray, IsInt, ValidateNested, IsISO8601
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateAddressDto {
  @IsOptional() @IsString() country?: string;
  @IsString() city: string;
  @IsOptional() @IsString() region?: string;
  @IsString() street: string;
  @IsString() house: string;
  @IsOptional() @IsString() apartment?: string;
  @IsOptional() @IsString() entrance?: string;
  @IsOptional() @IsString() postalCode?: string;
  latitude: number;
  longitude: number;
}

class CreateSegmentDto {
  @ValidateNested()
  @Type(() => CreateAddressDto)
  fromAddress: CreateAddressDto;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  toAddress: CreateAddressDto;

  @IsISO8601()
  departureTime: string;
}

export class CreateOrderDto {
  @IsString()
  vehicleType: string;

  @IsInt()
  purposeId: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  preferenceIds?: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSegmentDto)
  segments: CreateSegmentDto[];
}