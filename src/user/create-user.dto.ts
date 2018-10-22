import { IsNotEmpty, IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly password: string;
}
