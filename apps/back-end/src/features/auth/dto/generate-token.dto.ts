import { ApiProperty } from '@nestjs/swagger';

export class GenerateTokenDto {
  @ApiProperty({ description: 'User id' })
  id: number;
  @ApiProperty({ description: 'User email' })
  email: string;
}
