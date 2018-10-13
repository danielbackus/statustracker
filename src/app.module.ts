import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';

@Module({
  imports: [TypeOrmModule.forRoot(), OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
