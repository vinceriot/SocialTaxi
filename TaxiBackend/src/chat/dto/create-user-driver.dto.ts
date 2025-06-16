import { IsUUID } from 'class-validator';

export class CreateUserDriverDto {
  @IsUUID()
  driverId: string;
}