import { Expose, Type } from 'class-transformer';
import { SegmentDto } from '../../segments/dto/segment.dto';

export class OrderResponseDto {
  @Expose()
  id: string;

  @Expose()
  comment: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  vehicleType: string;

  @Expose()
  status: {
    code: string;
    name: string;
  } | null;

  @Expose()
  @Type(() => SegmentDto)
  segments: SegmentDto[];
}