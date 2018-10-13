import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  orderNumber: number;

  @Column('text')
  storeNumber: string;

  @Column('text', { nullable: true })
  customerName: string;

  @Column('text', { nullable: true })
  status: string;

  @Column('date', { nullable: true })
  orderDate: Date;

  @Column('date', { nullable: true })
  shipDate: Date;

  @Column('text', { nullable: true })
  shippingCarrier: string;

  @Column('date', { nullable: true })
  estimatedDeliveryDate: Date;
}
