import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from 'src/back-end/core/db/entities/booking.entity';
import { LocationEntity } from 'src/back-end/core/db/entities/location.entity';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';
import { AuthModule } from '../auth/auth.module';
import { LocationService } from './services/location.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, LocationEntity]),
    AuthModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, LocationService],
  exports: [BookingService, LocationService],
})
export class BookingModule {}
