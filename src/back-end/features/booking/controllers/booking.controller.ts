import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from 'src/back-end/core/decorators/auth.decorator';
import { BookingDto } from '../dto/booking.dto';
import { BookingService } from '../services/booking.service';
import { QueryDto } from 'src/back-end/core/dto/query.dto';

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
}
