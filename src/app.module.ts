import { Module } from '@nestjs/common';
import { DBModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './redis.module';
import { AuthModule } from './back-end/features/auth/auth.module';
import { BookingModule } from './back-end/features/booking/booking.module';
import { LocationSeed } from './back-end/core/seeds/location.seed';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './back-end/core/db/entities/location.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([LocationEntity]),
    ConfigModule.forRoot({ isGlobal: true }),
    DBModule,
    RedisCacheModule,
    AuthModule,
    BookingModule,
  ],
  providers: [LocationSeed],
})
export class AppModule {}
