import { IsOptional, IsUUID, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  comment?: string;
}