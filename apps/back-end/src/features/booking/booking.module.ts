import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from 'src/core/db/entities/booking.entity';
import { LocationEntity } from 'src/core/db/entities/location.entity';
import { BookingController } from './controllers/booking.controller';
import { AuthModule } from '../auth/auth.module';
import { LocationService } from './services/location.service';
import { BookingService } from './services/booking.service';
import { NotificationEntity } from 'src/core/db/entities/notification.entity';
import { UserService } from '../auth/services/user.service';
import { SheetsModule } from '../sheets/sheets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      LocationEntity,
      NotificationEntity,
    ]),
    AuthModule,
    SheetsModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, LocationService],
  exports: [BookingService, LocationService],
})
export class BookingModule {}
