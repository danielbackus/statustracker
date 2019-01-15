import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { InviteRepository } from './invite.repository';
import { UserRepository } from './user.repository';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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
    const user = {
      id: 1,
      email: 'foo@foo.com',
      active: true,
      password,
      bearer: 'bar',
    };
    userRepo.findOne = jest.fn(() => user);
    userRepo.save = jest.fn(() => {});
    const response = await service.login({
      email: 'foo@foo.com',
      password: 'foo',
    });
    expect(userRepo.save).toBeCalled();
    expect(response.id).toEqual(1);
    expect(response.bearer).not.toEqual('bar');
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
    expect(userRepo.create).toBeCalled();
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
  it.skip('sendInvite should call mail.send', () => {});
  it('forgotPassword should throw without email', async () => {
    try {
      await service.forgotPassword(null);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });
  it('forgotPassword should do nothing if no user', async () => {
    userRepo.findOne = jest.fn().mockReturnValueOnce(null);
    service.sendForgot = jest.fn();
    try {
      await service.forgotPassword('bad@bad.com');
    } catch (e) {
      expect(e).not.toBeDefined();
    } finally {
      expect(service.sendForgot).not.toBeCalled();
    }
  });
  it('forgotPassword should set reset token, save, & call sendForgot', async () => {
    const user = {
      email: 'foo@foo.com',
      reset: null,
    };
    userRepo.findOne = jest.fn().mockReturnValueOnce(user);
    userRepo.save = jest.fn();
    service.sendForgot = jest.fn();
    await service.forgotPassword(user.email);
    expect(userRepo.save).toBeCalledWith(
      expect.objectContaining({ email: 'foo@foo.com' }),
    );
    expect(service.sendForgot).toBeCalledWith(
      expect.objectContaining({ email: 'foo@foo.com' }),
    );
    expect(service.sendForgot).not.toBeCalledWith(
      expect.objectContaining({ reset: null }),
    );
  });
  it('getByReset should return null if no user', async () => {
    userRepo.findOne = jest.fn(() => null);
    const user = await service.getByReset('bad');
    expect(userRepo.findOne).toBeCalled();
    expect(user).toBeUndefined();
  });
  it('getByReset should return user', async () => {
    const user = {
      email: 'foo@foo.com',
      id: 1,
      reset: 'foo',
    };
    userRepo.findOne = jest.fn(() => user);
    const user2 = await service.getByReset(user.reset);
    expect(user2['email']).toEqual(user.email);
    expect(user2['id']).toEqual(user.id);
  });
  it('getInvite should throw if no invite', async () => {
    inviteRepo.findOne = jest.fn(() => null);
    try {
      await service.getInvite('bad');
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });
  it('getInvite should return corresponding email', async () => {
    const invite = { email: 'foo@foo.com' };
    inviteRepo.findOne = jest.fn(() => invite);
    const email = await service.getInvite('1');
    expect(email).toEqual(invite.email);
  });
});
