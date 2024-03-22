import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Status } from 'src/utility/enums/status-enum';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  added_by: number;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'added_by' })
  added_by_info: User;

  @OneToMany(() => Product, (product) => product.category_id)
  products: Product[];

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Timestamp;
}
