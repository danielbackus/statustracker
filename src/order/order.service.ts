import { Injectable, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './create-order.dto';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: OrderRepository,
  ) {}

  async create(request: CreateOrderDto): Promise<Order> {
    const order: Order = await this.orderRepository.create(request);
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }
}
