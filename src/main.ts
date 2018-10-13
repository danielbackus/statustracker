import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { renderFile } from 'ejs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .engine('html', renderFile)
    .setBaseViewsDir(join(__dirname, '../views'))
    .useStaticAssets(join(__dirname, '../views/public'), {
      index: false,
      redirect: false,
    })
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
  await app.listen(3000);
}
bootstrap();
