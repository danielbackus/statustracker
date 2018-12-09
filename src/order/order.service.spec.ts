import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';

describe('OrderService', () => {
  let service: OrderService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: 'OrderRepository',
          useClass: OrderRepository,
        },
      ],
    }).compile();
    service = module.get<OrderService>(OrderService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
