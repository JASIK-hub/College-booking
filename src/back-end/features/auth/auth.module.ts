import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/back-end/core/db/entities/user-entity';
import { TokenGenerationService } from './services/token-service';
import { RedisTokenService } from './services/redis-service';
import { UserController } from './controllers/auth-controller';
import { AuthService } from './services/auth-service';
import { UserService } from './services/user-service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule],
  controllers: [UserController],
  providers: [
    TokenGenerationService,
    RedisTokenService,
    AuthService,
    UserService,
  ],
  exports: [TokenGenerationService, RedisTokenService, AuthService],
})
export class AuthModule {}
