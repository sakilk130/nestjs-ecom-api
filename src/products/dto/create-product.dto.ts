import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Status } from 'src/utility/enums/status-enum';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title can not be empty' })
  @IsString({ message: 'Title should be string' })
  title: string;

  @IsNotEmpty({ message: 'Description can not be empty' })
  @IsString({ message: 'Description should be string' })
  description: string;

  @IsNotEmpty({ message: 'Price can not be empty' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price should be number & max decimal precision 2' },
  )
  @IsPositive({ message: 'Price should be positive number' })
  price: number;

  @IsNotEmpty({ message: 'Stock can not be empty' })
  @IsNumber({}, { message: 'Stock should be number' })
  @IsPositive({ message: 'Stock can not be negative' })
  @Min(0, { message: 'Stock can not be negative' })
  stock: number;

  @IsNotEmpty({ message: 'Image can not be empty' })
  @IsArray({ message: 'Image should be an array format' })
  images: string[];

  @IsNotEmpty({ message: 'Category can not be empty' })
  @IsNumber({}, { message: 'Category id should be a number' })
  category_id: number;

  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
