import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './adress.dto';

export class CreateUserAddressDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  label: string;
}