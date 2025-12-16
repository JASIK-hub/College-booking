import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleEnum } from 'src/core/db/enums/role-enum';

export class UserDto {
  @ApiProperty({ description: 'First name', type: String })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name', type: String })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @MinLength(2)
  password: string;

  @ApiProperty({ description: 'User phone number' })
  @IsPhoneNumber('KZ')
  phone: string;

  @ApiProperty({ description: 'Role' })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
