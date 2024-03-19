import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from 'src/utility/enums/user-roles.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name can not be empty' })
  @IsString({ message: 'Name should be string ' })
  name: string;

  @IsNotEmpty({ message: 'Email can not be empty' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password can not be empty' })
  @MinLength(5, { message: 'Password is minimum 5 characters long' })
  password: string;

  @IsOptional()
  @IsArray({ message: 'Provide correct format' })
  roles: Roles[];
}
