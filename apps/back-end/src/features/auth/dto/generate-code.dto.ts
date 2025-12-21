import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GenerateCodeDto {
  @ApiProperty({ description: 'Enter email' })
  @IsEmail({}, { message: 'Incorrect email' })
  email: string;
}
