import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from 'src/utility/enums/status-enum';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Title can not be empty' })
  @IsString({ message: 'Title should be string' })
  title: string;

  @IsNotEmpty({ message: 'Description can not be empty' })
  @IsString({ message: 'Description should be string' })
  description: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
