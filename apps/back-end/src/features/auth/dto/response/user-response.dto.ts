import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'First name', type: String })
  firstName: string;

  @ApiProperty({ description: 'Last name', type: String })
  lastName: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User phone number' })
  phone: string;
}
