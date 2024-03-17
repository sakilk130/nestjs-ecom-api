import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ default: '' })
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  post_code: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @OneToOne(() => Order, (order) => order.shipping_id)
  order: Order;

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;
}
