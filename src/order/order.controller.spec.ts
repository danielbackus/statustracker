import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';

describe('Order Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OrderController],
      components: [
        { provide: 'OrderRepository', useClass: Repository },
        OrderService,
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: OrderController = module.get<OrderController>(
      OrderController,
    );
    expect(controller).toBeDefined();
  });
});
