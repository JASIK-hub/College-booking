import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_KEYS } from './core/config/env-keys';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          config: {
            host: configService.get(ENV_KEYS.REDIS_HOST),
            port: configService.get(ENV_KEYS.REDIS_PORT),
          },
        };
      },
    }),
  ],
})
export class RedisCacheModule {}
