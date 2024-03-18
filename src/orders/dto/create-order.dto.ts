import { Type } from 'class-transformer';
import { CreateShippingDto } from './create-shipping.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { OrderedProductsDto } from './ordered-products.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shipping_address: CreateShippingDto;

  @IsNotEmpty()
  @Type(() => OrderedProductsDto)
  @ValidateNested()
  ordered_products: OrderedProductsDto[];
}
