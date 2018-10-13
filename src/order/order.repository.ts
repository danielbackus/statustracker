import { EntityRepository, Repository } from 'typeorm';
import { Order } from './order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async findByOrderAndStoreNumber(orderNumber: number, storeNumber: string) {
    const order: Order = await this.findOne({ orderNumber, storeNumber });
    return order;
  }
}
