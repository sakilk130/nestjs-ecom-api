import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderedProductsDto {
  @IsNotEmpty({ message: "Product can't be empty" })
  id: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Price should be number & max decimal precission 2',
    },
  )
  @IsPositive({ message: 'Price should be positive number' })
  product_unit_price: number;

  @IsNumber({}, { message: 'Quantity should be number' })
  @IsPositive({ message: 'Quantity should be positive number' })
  product_quantity: number;
}
