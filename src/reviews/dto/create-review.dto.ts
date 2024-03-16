import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product ID should not be empty' })
  @IsNumber({}, { message: 'Product ID should be number' })
  product_id: number;

  @IsNotEmpty({ message: 'Rating should not be empty' })
  @IsNumber({}, { message: 'Rating should be number' })
  @Min(1)
  @Max(5)
  ratings: number;

  @IsNotEmpty({ message: 'Comment should not be empty' })
  @IsString()
  comments: string;
}
