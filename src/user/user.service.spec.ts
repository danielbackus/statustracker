import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { InviteRepository } from './invite.repository';
import { UserRepository } from './user.repository';

describe('UserService', () => {
  let service: UserService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'InviteRepository',
          useValue: InviteRepository,
        },
        {
          provide: 'UserRepository',
          useClass: UserRepository,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
