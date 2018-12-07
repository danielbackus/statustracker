import { Repository, EntityRepository, Connection } from 'typeorm';
import { Invite } from './invite.entity';

@EntityRepository(Invite)
export class InviteRepository extends Repository<Invite> {}

export const InviteRepositoryProvider = {
  provide: 'InviteRepository',
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(InviteRepository),
  inject: [Connection],
};
