import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findOneByToken(token: string) {
    const user: User = await this.findOne({ token });
    return user;
  }
}
