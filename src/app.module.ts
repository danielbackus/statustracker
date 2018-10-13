import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forRoot(), OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
