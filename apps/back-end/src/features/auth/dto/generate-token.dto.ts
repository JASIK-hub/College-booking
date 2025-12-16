import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from 'src/core/db/enums/role-enum';

export class GenerateTokenDto {
  @ApiProperty({ description: 'User id' })
  id: number;
  @ApiProperty({ description: 'User email' })
  email: string;
  @ApiProperty()
  role: RoleEnum;
}
