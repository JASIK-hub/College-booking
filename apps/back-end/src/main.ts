import { LocationSeed } from './core/seeds/location.seed';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
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
