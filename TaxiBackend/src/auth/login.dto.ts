import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  password: string;
}