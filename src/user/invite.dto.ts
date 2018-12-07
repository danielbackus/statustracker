import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class InviteDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsUUID()
  readonly creator: string;
}
