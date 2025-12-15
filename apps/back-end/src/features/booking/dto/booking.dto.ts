import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum } from 'class-validator';
import { LocationsEnum } from 'src/core/db/enums/locations-enum.dto';

export class BookingDto {
  @ApiProperty({
    description: 'location in building',
    nullable: false,
    enum: LocationsEnum,
  })
  @IsEnum(LocationsEnum)
  location: LocationsEnum;

  @ApiProperty({
    description: 'booking start time',
    example: '2025-12-09T07:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'booking ending time',
    example: '2025-12-09T07:00:00Z',
  })
  @IsDateString()
  endTime: string;
}
