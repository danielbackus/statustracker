import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';

@Module({
  imports: [TypeOrmModule.forRoot(), OrderModule],
  controllers: [AppController],
})
export class AppModule {}
