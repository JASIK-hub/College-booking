import { ApiProperty } from '@nestjs/swagger';

export class CodeResponseDto {
  @ApiProperty()
  code: string;
}
