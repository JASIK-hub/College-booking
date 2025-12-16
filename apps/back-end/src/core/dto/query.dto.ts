import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({
    description: 'Filter by the date',
  })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'Filter by the date',
  })
  @IsOptional()
  @IsDateString()
  endTime: string;
}
