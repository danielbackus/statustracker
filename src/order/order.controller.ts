import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() request: CreateOrderDto) {
    return await this.orderService.create(request);
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }
}
