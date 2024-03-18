import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'Phone should not be empty' })
  @IsString({ message: 'Phone should be string' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Name should be string' })
  name: string;

  @IsNotEmpty({ message: "Address can't be empty" })
  @IsString({ message: 'Address should be string' })
  address: string;

  @IsNotEmpty({ message: "City can't be empty" })
  @IsString({ message: 'City should be string' })
  city: string;

  @IsNotEmpty({ message: "Post code can't be empty" })
  @IsString({ message: 'Post code should be string' })
  post_code: string;

  @IsNotEmpty({ message: "State can't be empty" })
  @IsString({ message: 'State should be string' })
  state: string;

  @IsNotEmpty({ message: "County can't be empty" })
  @IsString({ message: 'County should be string' })
  country: string;
}
