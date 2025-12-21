import { RedisService } from '@liaoliaots/nestjs-redis';
import { BadRequestException } from '@nestjs/common';
import Redis from 'ioredis';

export class SetCode {
  private redis: Redis;
  constructor(private redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }
  async setCodeToRedis() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redis.set('login_code', code, 'EX', 300);
    return code;
  }
  async getCodeFromRedis(inputCode: string) {
    const code = await this.redis.get('login_code');
    if (!code) {
      throw new BadRequestException();
    }
    const regex = /^\d{6}$/;
    if (!regex.test(code)) {
      throw new BadRequestException('Invalid code format');
    }
    return code == inputCode;
  }
}
