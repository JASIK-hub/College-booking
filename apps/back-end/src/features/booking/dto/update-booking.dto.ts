import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateBookingDto {
  @ApiPropertyOptional({ description: 'Описание бронирования' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Время начала бронирования',
    example: '2025-12-09T07:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'Время окончания бронирования',
    example: '2025-12-09T08:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  endTime?: string;
}
