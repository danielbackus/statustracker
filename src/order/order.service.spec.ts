import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';

describe('OrderService', () => {
  let service: OrderService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'OrderRepository', useClass: Repository },
        OrderService,
      ],
    }).compile();
    service = module.get<OrderService>(OrderService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
