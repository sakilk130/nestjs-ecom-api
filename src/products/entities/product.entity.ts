import { Category } from 'src/categories/entities/category.entity';
import { OrdersProducts } from 'src/orders/entities/orders-products.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column('simple-array')
  images: string[];

  @Column()
  added_by: number;

  @Column()
  category_id: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'added_by' })
  added_by_info: User;

  @ManyToOne(() => Category, (cat) => cat.products)
  @JoinColumn({ name: 'category_id' })
  category_id_info: Category;

  @OneToMany(() => Review, (review) => review.product_id_info)
  reviews: Review[];

  @OneToMany(() => OrdersProducts, (ordersProduct) => ordersProduct.product_id)
  products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;
}
