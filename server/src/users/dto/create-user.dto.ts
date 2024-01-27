import { IsEmail, Length } from '@nestjs/class-validator';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @Length(4, 40)
  @IsString()
  readonly username: string;

  @IsEmail()
  @IsString()
  readonly email: string;

  @Length(4, 40)
  @IsString()
  readonly password: string;
}
