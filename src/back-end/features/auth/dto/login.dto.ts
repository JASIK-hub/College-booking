import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ description: 'Enter email' })
  @IsEmail({}, { message: 'Incorrect email' })
  email: string;

  @ApiProperty({ description: 'Enter password' })
  @IsString()
  password: string;
}
