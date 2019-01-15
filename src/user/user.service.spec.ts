import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { InviteRepository } from './invite.repository';
import { UserRepository } from './user.repository';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as mail from '@sendgrid/mail';

describe('UserService', () => {
  let module: TestingModule;
  let service: UserService;
  let inviteRepo: InviteRepository;
  let userRepo: UserRepository;
  beforeAll(async () => {
    module = await Test.createTestingModule({
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
    inviteRepo = module.get<InviteRepository>(InviteRepository);
    userRepo = module.get<UserRepository>(UserRepository);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('validateUser should throw unauthorized exception if bad user', async () => {
    userRepo.findByBearer = jest.fn().mockReturnValue(null);
    try {
      const user = await service.validateUser('foo');
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });
  it('login should function', async () => {
    const password = await bcrypt.hash('foo', 1);
    userRepo.findOne = jest.fn().mockResolvedValueOnce({
      id: 1,
      email: 'foo@foo.com',
      active: true,
      password,
    });
    userRepo.save = jest.fn(() => {});
    const response = await service.login({
      email: 'foo@foo.com',
      password: 'foo',
    });
    expect(response.id).toEqual(1);
  });
  it('notExpired should return correctly', () => {
    const valid = new Date();
    const invalid = new Date();
    invalid.setHours(valid.getHours() - 2);
    expect(service.notExpired(valid)).toBeTruthy();
    expect(service.notExpired(invalid)).toBeFalsy();
  });
  it('create should complete', async () => {
    const invite = {
      id: 'baz',
      email: 'foo@foo.com',
      creator: 'bar@bar.com',
    };
    inviteRepo.findOne = jest.fn(() => invite);
    inviteRepo.delete = jest.fn(() => {});
    userRepo.create = jest.fn(user => user);
    userRepo.save = jest.fn(user => {
      expect(user.email).toEqual('foo@foo.com');
    });
    const user = await service.create({
      password: 'foo',
      invite: 'baz',
    });
    expect(userRepo.save).toBeCalled();
    expect(inviteRepo.delete).toBeCalled();
  });
  it('create should throw w/o invite', async () => {
    inviteRepo.findOne = jest.fn(() => null);
    try {
      await service.create({ password: 'foo', invite: null });
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });
});
