import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from 'src/utility/enums/status-enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name should be string ' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
