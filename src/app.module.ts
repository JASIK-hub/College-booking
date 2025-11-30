import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './redis.module';
import { AuthModule } from './back-end/features/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DBModule,
    RedisCacheModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
