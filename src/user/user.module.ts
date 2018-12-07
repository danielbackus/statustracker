import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserRepositoryProvider } from './user.repository';
import { InviteRepositoryProvider } from './invite.repository';
import { HttpStrategy } from './http.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'bearer' }),
  ],
  providers: [
    UserRepositoryProvider,
    UserService,
    InviteRepositoryProvider,
    HttpStrategy,
  ],
  controllers: [UserController],
})
export class UserModule {}
