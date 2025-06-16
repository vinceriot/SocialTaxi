import { Expose, Type } from 'class-transformer';
import { AddressDto } from '../../address/adress.dto';

export class SegmentDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => AddressDto)
  fromAddress: AddressDto;

  @Expose()
  @Type(() => AddressDto)
  toAddress: AddressDto;

  @Expose()
  departureTime: Date;

  @Expose()
  arrivalTime: Date;

  @Expose()
  comment: string;

  @Expose()
  status: {
    code: string;
    name: string;
  };
}