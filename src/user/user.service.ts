import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private saltRounds = process.env.BCRYPT_SALT_ROUNDS || 10;
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async findOneByToken(token: string): Promise<any> {
    return this.userRepository.findOneByToken(token);
  }

  async createUser(user: User): Promise<User> {
    user.password = await this.getHash(user.password);
    return this.userRepository.save(user);
  }

  async getHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
