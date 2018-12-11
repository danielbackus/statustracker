import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import {
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';

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
  afterEach(async () => {
    module.get<OrderController>(OrderController).unlock();
  });
  it('should be defined', () => {
    const controller: OrderController = module.get<OrderController>(
      OrderController,
    );
    expect(controller).toBeDefined();
  });
  it('should always throw when locked', async () => {
    const controller: OrderController = module.get<OrderController>(
      OrderController,
    );
    controller.lock();
    try {
      await controller.findByOrderNumber({});
    } catch (e) {
      expect(e).toBeInstanceOf(ServiceUnavailableException);
    }
    try {
      await controller.uploadFile({});
    } catch (e) {
      expect(e).toBeInstanceOf(ServiceUnavailableException);
    }
  });
  it('findByOrder() should throw with bad params', async () => {
    const controller: OrderController = module.get<OrderController>(
      OrderController,
    );
    const service: OrderService = module.get<OrderService>(OrderService);
    try {
      const fn = jest.spyOn(service, 'findByOrderAndStore');
      await controller.findByOrderNumber({});
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });
  xit('findByOrder() should return an array of orders', async () => {});
  it('uploadFile() should throw with bad params', async () => {
    const controller: OrderController = module.get<OrderController>(
      OrderController,
    );
    const service: OrderService = module.get<OrderService>(OrderService);
    try {
      const fn = jest.spyOn(service, 'findByOrderAndStore');
      await controller.uploadFile({});
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });
  xit('uploadFile() should return', async () => {});
});
