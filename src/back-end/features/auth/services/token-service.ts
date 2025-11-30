import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ENV_KEYS } from 'src/back-end/core/config/env-keys';
import { UserEntity } from 'src/back-end/core/db/entities/user-entity';
import { RedisTokenService } from './redis-service';
import { UserService } from './user-service';

@Injectable()
export class TokenGenerationService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => RedisTokenService))
    private redisService: RedisTokenService,
  ) {}

  async generateTokens(user: UserEntity) {
    const userData = await this.userService.findOne(user);
    if (!userData) {
      throw new NotFoundException('Пользователь не найден');
    }
    const payloadAccess = {
      id: userData.id,
      identifier: userData.email,
      type: 'access',
    };
    const payloadRefresh = {
      id: userData.id,
      identifier: userData.email,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(payloadAccess, {
      expiresIn: this.configService.get(ENV_KEYS.ACCESS_TOKEN_EXPIRATION),
    });
    const refreshToken = this.jwtService.sign(payloadRefresh, {
      expiresIn: this.configService.get(ENV_KEYS.ACCESS_TOKEN_EXPIRATION),
    });
    await this.redisService.setRefreshToken(refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async calculateExpTime(token: string) {
    const decoded = this.jwtService.decode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp - now;
  }
}
