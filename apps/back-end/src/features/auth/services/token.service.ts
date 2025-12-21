import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ENV_KEYS } from 'src/core/config/env-keys';
import { RedisTokenService } from './redis.service';
import { UserDto } from '../dto/user.dto';
import { FetchSheetsService } from 'src/features/sheets/services/sheets.service';

@Injectable()
export class TokenGenerationService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => RedisTokenService))
    private redisService: RedisTokenService,
    private sheetsSerice: FetchSheetsService,
  ) {}
  async generateTokens(dto: UserDto) {
    const users = await this.sheetsSerice.getUsers();
    const userData = users.find((user) => user.email == dto.email);
    if (!userData) {
      throw new NotFoundException('Пользователь не найден');
    }
    const payloadAccess = {
      identifier: userData.email,
      role: userData.role,
      type: 'access',
    };
    const payloadRefresh = {
      identifier: userData.email,
      role: userData.role,
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
  validateToken(token: string) {
    const secret = this.configService.get<string>(ENV_KEYS.JWT_SECRET);
    try {
      const payload = this.jwtService.verify(token, { secret });
      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  calculateExpTime(token: string) {
    const decoded = this.jwtService.decode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp - now;
  }
}
