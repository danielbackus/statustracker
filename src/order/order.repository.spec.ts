import { Test, TestingModule } from '@nestjs/testing';
import { getRepository } from 'typeorm';
import { OrderRepository } from './order.repository';
import { Order } from './order.entity';

describe('OrderRepository', () => {
  let repo: OrderRepository;
  let args;
  beforeAll(async () => {
    repo = new OrderRepository();
    args = {
      orderNumber: 123,
      storeNumber: '123',
    };
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should call findOne with the same args from findByOrderAndStoreNumber()', async () => {
    repo.findOne = jest.fn();
    await repo.findByOrderAndStoreNumber(args.orderNumber, args.storeNumber);
    expect(repo.findOne).toBeCalledWith({
      orderNumber: args.orderNumber,
      storeNumber: args.storeNumber,
    });
  });
});
