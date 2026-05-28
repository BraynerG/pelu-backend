import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './infrastructure/filters/all-exceptions.filter';
import { ValidationException } from './domain/exceptions/domain.exception';
import { INestApplication } from '@nestjs/common';
import { Express } from 'express';

let cachedApp: INestApplication;

async function createApp(): Promise<INestApplication> {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.init();

  cachedApp = app;
  return app;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  const app = await createApp();
  const expressApp = app.getHttpAdapter().getInstance() as Express;
  expressApp(req, res);
}

// Local dev bootstrap
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    const app = await createApp();
    await app.listen(process.env.PORT ?? 3001);
    console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 3001}`);
  })();
}
