import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from 'src/core/decorators/auth.decorator';
import { BookingDto } from '../dto/booking.dto';
import { BookingService } from '../services/booking.service';
import { QueryDto } from 'src/core/dto/query.dto';
import { RoleEnum } from 'src/core/db/enums/role-enum';
import { UpdateBookingDto } from '../dto/update-booking.dto';

@Auth()
@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}
  @Post('')
  @ApiResponse({ status: 200, description: 'Location successfully booked' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'Book location' })
  async bookLocation(@Req() req, @Body() dto: BookingDto) {
    const userId = req.user.id;
    return await this.bookingService.bookLocation(userId, dto);
  }
  @Get('getAll')
  @ApiResponse({ status: 200, description: 'Bookings successfully fetched' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'Get all bookings' })
  async getAllBookings(@Req() req, @Query() query: QueryDto) {
    const userId = req.user.id;
    return await this.bookingService.getAllBookings(userId, query);
  }
  @Auth([RoleEnum.ADMIN])
  @Patch(':id/change')
  @ApiResponse({ status: 200, description: 'Booking successfully changed' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'change booking data' })
  async changeBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
  ) {
    return await this.bookingService.changeBookingData(id, dto);
  }
  @Auth([RoleEnum.ADMIN])
  @Delete(':id/delete')
  @ApiResponse({ status: 200, description: 'Booking successfully deleted' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'delete booking' })
  async deleteBooking(@Param('id', ParseIntPipe) id: number) {
    console.log('id,\n', id);
    return await this.bookingService.deleteBooking(id);
  }
}
