import { Category } from 'src/categories/entities/category.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Roles } from 'src/utility/enums/user-roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: [Roles.USER],
    array: true,
  })
  roles: Roles[];

  @OneToMany(() => Category, (cat) => cat.added_by)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.added_by)
  products: Product[];

  @OneToMany(() => Review, (review) => review.user_id)
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.updated_by)
  orders_updated_by: Order[];

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;
}
