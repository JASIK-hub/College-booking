import { BaseService } from 'src/core/services/base-service';
import { UserService } from '../../auth/services/user.service';
import { BookingDto } from '../dto/booking.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingEntity } from 'src/core/db/entities/booking.entity';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { QueryDto } from 'src/core/dto/query.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';

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
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);
    const overlappingBooking = await this.bookingRepository.findOne({
      where: {
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });
    if (overlappingBooking) {
      throw new BadRequestException('Booking on this date/time already exists');
    }
    const booking = this.bookingRepository.create({
      ...dto,
      location,
      startTime,
      endTime,
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
    if (query.startTime && query.endTime && query.startTime > query.endTime) {
      throw new BadRequestException('startTime cannot be later than endTime');
    }
    let where: any = {};
    if (query.startTime) where.startTime = MoreThanOrEqual(query.startTime);
    if (query.endTime) where.endTime = LessThanOrEqual(query.endTime);
    const bookings = await this.bookingRepository.find({
      where,
      relations: ['user', 'location'],
    });
    if (!bookings.length) {
      return [];
    }
    return bookings;
  }

  async changeBookingData(bookingId: number, dto: UpdateBookingDto) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    await this.bookingRepository.update(bookingId, dto);
    return await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
  }
  async deleteBooking(bookingId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return await this.bookingRepository.delete(bookingId);
  }
}
