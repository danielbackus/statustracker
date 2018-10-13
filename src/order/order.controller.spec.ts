import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './create-order.dto';

describe('Order Controller', () => {
  let module: TestingModule;
  let controller: OrderController;
  let service: OrderService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OrderController],
      components: [
        { provide: 'OrderRepository', useClass: Repository },
        OrderService,
      ],
    }).compile();
    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should call OrderService.create()', async () => {
    service.create = jest.fn();
    const params: CreateOrderDto = { orderNumber: 123, storeNumber: '123' };
    controller.create(params);
    expect(service.create).toBeCalledWith(params);
  });
  it('should call OrderService.findAll()', async () => {
    service.findAll = jest.fn();
    controller.findAll();
    expect(service.findAll).toBeCalled();
  });
});
