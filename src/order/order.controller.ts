import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './create-order.dto';
import { Order } from './order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() request: CreateOrderDto): Promise<Order> {
    return await this.orderService.create(request);
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }
}
