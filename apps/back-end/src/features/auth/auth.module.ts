import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { TokenGenerationService } from './services/token.service';
import { RedisTokenService } from './services/redis.service';
import { UserController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ENV_KEYS } from 'src/core/config/env-keys';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(ENV_KEYS.JWT_SECRET),
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    TokenGenerationService,
    RedisTokenService,
    AuthService,
    UserService,
  ],
  exports: [
    TokenGenerationService,
    RedisTokenService,
    AuthService,
    UserService,
  ],
})
export class AuthModule {}
