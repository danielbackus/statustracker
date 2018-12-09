import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';

describe('Order Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: 'OrderRepository',
          useClass: OrderRepository,
        },
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
