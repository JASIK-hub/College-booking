import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class PendingBookingDto {
  @ApiPropertyOptional({ description: 'Описание бронирования' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Время начала бронирования',
    example: '2025-12-09T07:00:00Z',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  pendingStartTime?: Date | null;

  @ApiPropertyOptional({
    description: 'Время окончания бронирования',
    example: '2025-12-09T08:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  pendingEndTime?: Date | null;
}
