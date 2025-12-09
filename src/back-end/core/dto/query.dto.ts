import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({
    description: 'Filter by the date',
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'Filter by the date',
  })
  @IsOptional()
  @IsString()
  endTime: string;
}
