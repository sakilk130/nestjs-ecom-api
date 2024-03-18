import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/utility/enums/order-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Shipping } from './shipping.entity';
import { OrdersProducts } from './orders-products.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  order_at: Timestamp;

  @Column({ type: 'enum', default: OrderStatus.PROCESSING, enum: OrderStatus })
  status: string;

  @Column({ nullable: true })
  shipped_at: Date;

  @Column({ nullable: true })
  delivered_at: Date;

  @Column({ nullable: true })
  updated_by: number;

  @Column()
  shipping_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.orders_updated_by)
  @JoinColumn({ name: 'updated_by' })
  updated_by_info: User;

  @OneToOne(() => Shipping, (shipping) => shipping.order, { cascade: true })
  @JoinColumn({ name: 'shipping_id' })
  shipping_id_info: Shipping;

  @OneToMany(() => OrdersProducts, (ordersProduct) => ordersProduct.order_id, {
    cascade: true,
  })
  products: OrdersProducts[];

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user_id_info: User;

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;
}
