import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string; // обязательно должно быть именно это поле
}