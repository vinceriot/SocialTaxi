import { Expose } from 'class-transformer';

export class DriverDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  surname: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  avatarUrl?: string;

}