import { LocationSeed } from './core/seeds/location.seed';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from './core/config/env-keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  app.use(
    session({
      secret: configService.get(ENV_KEYS.SESSION_SECRET) as string,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 5 * 60 * 1000 },
    }),
  );
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  const seed = app.get(LocationSeed);
  await seed.run();

  const config = new DocumentBuilder()
    .setDescription('  :)  ')
    .setTitle('College Booking')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  console.log(
    `
  ██████  ██████╗ ██╗     ██╗     ███████╗ ██████╗ ███████╗
 ██╔═══  ██╔═══██╗██║     ██║     ██╔════╝██╔════╝ ██╔════╝
 ██║     ██║   ██║██║     ██║     █████╗  ██║  ███║█████╗
 ██║     ██║   ██║██║     ██║     ██╔══╝  ██║   ██║██╔══╝  
 ╚██████ ╚██████╔╝███████╗███████╗███████╗╚██████╔╝███████╗   
  ╚═════  ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝   
    
    📋 Application Info:
    
    ┌─────────┬──────────────────┬────────────────────────────────────────┐
    │ (index) │     Название     │                Ссылка                  │
    ├─────────┼──────────────────┼────────────────────────────────────────┤
    │    0    │ '🚀 API'         │ 'http://localhost:3000'                │
    │    1    │ '📘 Swagger Docs'│ 'http://localhost:3000/docs'           │
    └─────────┴──────────────────┴────────────────────────────────────────┘
    `,
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
