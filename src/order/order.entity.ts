import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  orderNumber: number;

  @Column('text')
  storeNumber: string;

  @Column('date', { nullable: true })
  eta: Date;

  @CreateDateColumn()
  created: Date;
}
