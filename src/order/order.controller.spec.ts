import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './order.entity';

describe('Order Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(getRepositoryToken(Order))
      .useValue({
        find: () => [],
      })
      .compile();
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
  it('findByOrder() should call service.findByOrder...() & return an array of orders', async () => {
    const controller: OrderController = module.get<OrderController>(
      OrderController,
    );
    const service: OrderService = module.get<OrderService>(OrderService);
    const fn = jest.spyOn(service, 'findByOrderAndStore');
    await controller.findByOrderNumber({
      orderNumber: 1,
      storeNumber: 1,
    });
    expect(fn).toBeCalled();
  });
  it('uploadFile() should throw with bad params', async () => {
    const controller: OrderController = module.get<OrderController>(
      OrderController,
    );
    try {
      await controller.uploadFile({});
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });
  it('uploadFile() should call', async () => {
    const controller: OrderController = module.get<OrderController>(
      OrderController,
    );
    const service: OrderService = module.get<OrderService>(OrderService);
    const fn = jest.spyOn(service, 'handleUpload');
    try {
      await controller.uploadFile({});
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
    expect(fn).toBeCalled();
  });
});
