import { ENV_KEYS } from './core/config/env-keys';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'postgres',
          host: configService.get<string>(ENV_KEYS.DB_HOST),
          port: Number(configService.get(ENV_KEYS.DB_PORT)),
          password: configService.get<string>(ENV_KEYS.DB_PASSWORD),
          username: configService.get<string>(ENV_KEYS.DB_USERNAME),
          database: configService.get<string>(ENV_KEYS.DB_NAME),
          autoLoadEntities: true,
          synchronize: true,
          logging: true,
        };
      },
    }),
  ],
})
export class DBModule {}
