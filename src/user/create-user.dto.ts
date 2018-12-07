import {
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/\d/)
  @Matches(/\W/)
  readonly password: string;

  @IsNotEmpty()
  @IsUUID()
  readonly invite: string;
}
