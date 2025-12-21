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
import { RoleEnum } from 'src/core/db/enums/role.enum';
import { PendingBookingDto } from '../dto/pending-booking.dto';

@Auth()
@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}
  @Post('')
  @ApiResponse({ status: 200, description: 'Location successfully booked' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'Book location' })
  async bookLocation(@Req() req, @Body() dto: BookingDto) {
    return await this.bookingService.bookLocation(dto, req);
  }
  @Get('getAll')
  @ApiResponse({ status: 200, description: 'Bookings successfully fetched' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'Get all bookings' })
  async getAllBookings(@Req() req, @Query() query: QueryDto) {
    return await this.bookingService.getAllBookings(req, query);
  }
  @Auth()
  @Patch(':id/change')
  @ApiResponse({ status: 200, description: 'Booking successfully changed' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'change booking data' })
  async changeBooking(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PendingBookingDto,
  ) {
    return await this.bookingService.changeBooking(req, id, dto);
  }
  @Auth()
  @Delete(':id/delete')
  @ApiResponse({ status: 200, description: 'Booking successfully deleted' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'delete booking' })
  async deleteBooking(@Param('id', ParseIntPipe) id: number) {
    await this.bookingService.deleteBooking(id);
    return true;
  }
  @Auth([RoleEnum.ADMIN])
  @Get('all/admin/pending')
  @ApiResponse({ status: 200, description: 'Bookings successfully fetched' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'get all pending bookings for admin' })
  async getAllPending() {
    return await this.bookingService.getPendingBookings();
  }
  @Auth([RoleEnum.ADMIN])
  @Post(':id/admin/approve')
  @ApiResponse({ status: 200, description: 'Booking was approved' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'approve booking' })
  async approveBooking(@Param('id', ParseIntPipe) id: number) {
    return await this.bookingService.approveBooking(id);
  }
  @Auth([RoleEnum.ADMIN])
  @Delete(':id/admin/decline')
  @ApiResponse({ status: 200, description: 'Booking was declined ' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'decline booking' })
  async declineBooking(@Param('id', ParseIntPipe) id: number) {
    await this.bookingService.declineBooking(id);
    return [];
  }
  @Auth([RoleEnum.ADMIN])
  @Patch(':id/admin/edit/approve')
  @ApiResponse({ status: 200, description: 'Booking was approved' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'approve booking' })
  async approveEditBooking(@Param('id', ParseIntPipe) id: number) {
    return await this.bookingService.approveEditBooking(id);
  }
}
