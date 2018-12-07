import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { renderFile } from 'ejs';
import { AppModule } from './app.module';
import * as frameguard from 'frameguard';
import * as rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .engine('html', renderFile)
    .setBaseViewsDir(join(__dirname, '../views'))
    .useStaticAssets(join(__dirname, '../views/public'), {
      index: false,
      redirect: false,
    })
    .useStaticAssets(join(__dirname, '../node_modules'))
    .disable('x-powered-by')
    .use(frameguard({ action: 'deny' }))
    .use('/api/', apiLimiter)
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
  await app.listen(3000);
}
bootstrap();
