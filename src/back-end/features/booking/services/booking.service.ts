import { BaseService } from 'src/back-end/core/services/base-service';
import { UserService } from '../../auth/services/user.service';
import { BookingDto } from './../dto/booking.dto';
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { BookingEntity } from 'src/back-end/core/db/entities/booking.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { QueryDto } from 'src/back-end/core/dto/query.dto';

@Injectable()
export class BookingService extends BaseService<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    private userService: UserService,
    private locationService: LocationService,
  ) {
    super(bookingRepository);
  }

  async bookLocation(userId: number, dto: BookingDto) {
    const user = await this.userService.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException();
    }
    const location = await this.locationService.findOneBy({
      name: dto.location,
    });
    if (!location) {
      throw new NotFoundException();
    }
    const booking = this.bookingRepository.create({
      location,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      user,
      status: 'booked',
    });
    return this.bookingRepository.save(booking);
  }
  async getAllBookings(userId: number, query: QueryDto) {
    const user = await this.userService.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException();
    }
    let where: any = {};
    if (query.startTime) where.startTime = MoreThanOrEqual(query.startTime);
    if (query.endTime) where.endTime = LessThanOrEqual(query.endTime);
    const bookings = await this.bookingRepository.find({
      where,
      relations: ['user', 'location'],
    });
    if (!bookings.length) {
      throw new NotFoundException('No bookings found for the given criteria');
    }
    return bookings;
  }
}
