import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
  if (!fs.existsSync('./files')) fs.mkdirSync('./files');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT || 80);
}
bootstrap();
