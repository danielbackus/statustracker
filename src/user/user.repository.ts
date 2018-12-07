import { Repository, EntityRepository, Connection } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByBearer(token: string): Promise<User> {
    const user: User = await this.findOne({ bearer: token });
    return user;
  }
  async createWithInvite(request: CreateUserDto) {}
}

export const UserRepositoryProvider = {
  provide: 'UserRepository',
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(UserRepository),
  inject: [Connection],
};
