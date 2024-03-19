import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PasswordChangeDto {
  @IsNotEmpty({ message: "Current password can't be empty" })
  @IsString({ message: 'Current password should be string' })
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  newPassword: string;
}
