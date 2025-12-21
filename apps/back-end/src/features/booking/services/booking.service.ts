import { BaseService } from 'src/core/services/base-service';
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
  Not,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { QueryDto } from 'src/core/dto/query.dto';
import { PendingBookingDto } from '../dto/pending-booking.dto';
import { FetchSheetsService } from 'src/features/sheets/services/sheets.service';
import { BookingStatusEnum } from 'src/core/db/enums/booking-status.enum';
import { RoleEnum } from 'src/core/db/enums/role.enum';

@Injectable()
export class BookingService extends BaseService<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    private fetchSheets: FetchSheetsService,
    private locationService: LocationService,
  ) {
    super(bookingRepository);
  }

  async bookLocation(dto: BookingDto, req: Request) {
    const email = (req as any).user.identifier;
    const users = await this.fetchSheets.getUsers();
    const user = users.find((user) => email == user.email);
    if (!user) {
      throw new NotFoundException();
    }
    if (dto.startTime && dto.endTime && dto.startTime > dto.endTime) {
      throw new BadRequestException('Невалидный формат времени');
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
        location: { id: location.id },
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });
    if (overlappingBooking) {
      throw new BadRequestException('Бронирование в это время уже существует');
    }
    const booking = this.bookingRepository.create({
      ...dto,
      location,
      startTime,
      endTime,
      user,
      status:
        (req as any).user.role == RoleEnum.ADMIN
          ? BookingStatusEnum.BOOKED
          : BookingStatusEnum.PENDING,
    });
    return this.bookingRepository.save(booking);
  }
  async getPendingBookings() {
    const bookings: BookingEntity[] = await this.bookingRepository.find({
      where: { status: BookingStatusEnum.PENDING },
      relations: ['user', 'location'],
    });
    if (bookings.length === 0) {
      throw new NotFoundException('Бронирования не найдены');
    }
    return bookings;
  }
  async approveBooking(id: number) {
    const booking = await this.bookingRepository.findOneBy({
      id,
      status: BookingStatusEnum.PENDING,
    });
    if (!booking) {
      throw new NotFoundException('Бронирование не найдено');
    }
    booking.status = BookingStatusEnum.BOOKED;
    await this.bookingRepository.save(booking);
    return booking;
  }

  async declineBooking(id: number) {
    const booking = await this.bookingRepository.findOneBy({
      id,
      status: BookingStatusEnum.PENDING,
    });
    if (!booking) {
      throw new NotFoundException('Бронирование не найдено');
    }
    await this.bookingRepository.remove(booking);
    return booking;
  }

  async getAllBookings(req, query: QueryDto) {
    const email = (req as any).user.identifier;
    const users = await this.fetchSheets.getUsers();
    const user = users.find((user) => email == user.email);
    if (!user) {
      throw new NotFoundException();
    }
    if (query.startTime && query.endTime && query.startTime > query.endTime) {
      throw new BadRequestException('Невалидный формат времени');
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
  async changeBooking(req, bookingId: number, dto: PendingBookingDto) {
    const role = (req as any).user.role;
    let booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (
      dto.pendingStartTime &&
      dto.pendingEndTime &&
      dto.pendingStartTime > dto.pendingEndTime
    ) {
      throw new BadRequestException('Невалидный формат времени');
    }
    if (!booking) {
      throw new NotFoundException('Бронирование не найдено');
    }
    const where: any = {};
    if (dto.pendingEndTime) where.startTime = LessThan(dto.pendingEndTime);
    if (dto.pendingStartTime) where.endTime = MoreThan(dto.pendingStartTime);

    if (Object.keys(where).length > 0) {
      const overlappingBooking = await this.bookingRepository.findOne({
        where: {
          ...where,
          location: booking.location,
          id: Not(bookingId),
        },
      });
      if (overlappingBooking) {
        throw new BadRequestException(
          'Бронирование в это время уже существует',
        );
      }
    }
    if (dto.description) {
      booking.description = dto.description;
    }
    if (role == RoleEnum.ADMIN) {
      booking = {
        ...booking,
        startTime: dto.pendingStartTime as Date,
        endTime: dto.pendingEndTime as Date,
        pendingStartTime: null,
        pendingEndTime: null,
        status: BookingStatusEnum.BOOKED,
      };
    } else {
      booking = {
        ...booking,
        pendingStartTime: dto.pendingStartTime,
        pendingEndTime: dto.pendingEndTime,
        status: BookingStatusEnum.PENDING,
      };
    }
    await this.bookingRepository.save(booking);
    return await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
  }

  async approveEditBooking(bookingId: number) {
    let booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Бронирование не найдено');
    }
    if (booking.pendingStartTime) {
      booking.startTime = booking.pendingStartTime;
      booking.pendingStartTime = undefined;
    }
    if (booking.pendingEndTime) {
      booking.endTime = booking.pendingEndTime;
      booking.pendingEndTime = undefined;
    }
    booking.status = BookingStatusEnum.BOOKED;
    await this.bookingRepository.save(booking);
    return booking;
  }

  async deleteBooking(bookingId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Бронирование не найдено');
    }
    await this.bookingRepository.delete(bookingId);
  }
}
