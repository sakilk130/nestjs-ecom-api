import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductListSearchQueryDto {
  @IsNotEmpty()
  page?: number;

  @IsNotEmpty()
  page_size?: number;

  @IsOptional()
  @IsString({ message: 'Search term should be string' })
  search_term?: string;
}
