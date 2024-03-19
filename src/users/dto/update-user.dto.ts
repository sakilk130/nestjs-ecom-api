import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name should be string ' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;
}
