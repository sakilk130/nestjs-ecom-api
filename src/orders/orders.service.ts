import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrdersProducts } from './entities/orders-products.entity';
import { Shipping } from './entities/shipping.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrdersProducts)
    private readonly orderProductsRepo: Repository<OrdersProducts>,
    @InjectRepository(Shipping)
    private readonly shippingRepo: Repository<Shipping>,
    private readonly productService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, currentUser: User) {
    try {
      const shipping = new Shipping();
      Object.assign(shipping, createOrderDto.shipping_address);

      const order = new Order();
      order.shipping_id_info = shipping;
      order.user_id_info = currentUser;

      const orderTbl = await this.orderRepo.save(order);

      const opEntity: {
        order_id: number;
        product_id: number;
        product_quantity: number;
        product_unit_price: number;
      }[] = [];
      for (let i = 0; i < createOrderDto.ordered_products.length; i++) {
        const order = orderTbl;
        const product = await this.productService.findOne(
          createOrderDto.ordered_products[i].id,
        );
        const product_quantity =
          createOrderDto.ordered_products[i].product_quantity;
        const product_unit_price =
          createOrderDto.ordered_products[i].product_unit_price;
        opEntity.push({
          order_id: order.id,
          product_id: product.id,
          product_quantity,
          product_unit_price,
        });
      }
      await this.orderProductsRepo
        .createQueryBuilder()
        .insert()
        .into(OrdersProducts)
        .values(opEntity)
        .execute();
      return await this.findOne(orderTbl.id);
    } catch (error) {
      return error;
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
