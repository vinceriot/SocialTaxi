import {
  IsEnum,
  ArrayMinSize,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateConversationDto {
  @IsEnum(['user_driver', 'user_support', 'driver_support'])
  type: 'user_driver' | 'user_support' | 'driver_support';

  @IsArray()
  @ArrayMinSize(2)
  participants: {
    userId: string; // UUID
    role: 'user' | 'driver' | 'support';
  }[];
}