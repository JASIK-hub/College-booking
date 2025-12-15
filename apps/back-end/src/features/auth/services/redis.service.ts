import { RedisService } from '@liaoliaots/nestjs-redis';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { TokenGenerationService } from './token.service';

@Injectable()
export class RedisTokenService {
  private redis: Redis;
  constructor(
    @Inject(forwardRef(() => TokenGenerationService))
    private tokenService: TokenGenerationService,
    @Inject(RedisService)
    private redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }
  async setRefreshToken(token: string) {
    const expTime = this.tokenService.calculateExpTime(token);
    const key = `token:${token}`;
    this.redis.set(key, token, 'EX', expTime);
  }
}
