import {
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/\d/)
  @Matches(/\W/)
  readonly password: string;
}
