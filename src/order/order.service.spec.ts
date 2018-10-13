import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './create-order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let repo: OrderRepository;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderRepository, OrderService],
    }).compile();
    service = module.get<OrderService>(OrderService);
    repo = module.get<OrderRepository>(OrderRepository);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should call Repository.find() from findAll()', async () => {
    repo.find = jest.fn();
    await service.findAll();
    expect(repo.find).toBeCalled();
  });
  it('should call Repository.create() and Repository.save() when create() has good args', async () => {
    const args: CreateOrderDto = {
      orderNumber: 123,
      storeNumber: '123',
    };
    repo.create = jest.fn();
    repo.save = jest.fn();
    await service.create(args);
    expect(repo.create).toBeCalled();
    expect(repo.save).toBeCalled();
  });
});
