import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { InviteRepository } from './invite.repository';
import { UserRepository } from './user.repository';

describe('User Controller', () => {
  let module: TestingModule;
  let controller: UserController;
  let service: UserService;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UserController],
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
    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });
  it('get() should call find()', async () => {
    const fn = (service.find = jest.fn());
    await controller.get();
    expect(fn).toBeCalled();
  });
  it('login() should call login()', async () => {
    const fn = (service.login = jest.fn());
    await controller.login({ email: 'foo@foo.com', password: 'bar' });
    expect(fn).toBeCalled();
  });
  it('create() should call create()', async () => {
    const fn = (service.create = jest.fn());
    await controller.create({ password: 'foo', invite: 'bar' });
    expect(fn).toBeCalled();
  });
  it('invite() should call invite()', async () => {
    const fn = (service.invite = jest.fn());
    await controller.invite({ email: 'foo@foo.com', creator: 'bar@bar.com' });
    expect(fn).toBeCalled();
  });
  it('getInvite() should call getInvite()', async () => {
    const fn = (service.getInvite = jest.fn());
    await controller.getInvite({});
    expect(fn).toBeCalled();
  });
  it('forgotPassword() should call forgotPassword()', async () => {
    const fn = (service.forgotPassword = jest.fn());
    await controller.forgotPassword({});
    expect(fn).toBeCalled();
  });
  it('resetPassword() should call resetPassword()', async () => {
    const fn = (service.resetPassword = jest.fn());
    await controller.resetPassword({});
    expect(fn).toBeCalled();
  });
  it('getByReset() should call getByReset()', async () => {
    const fn = (service.getByReset = jest.fn());
    await controller.getByReset({});
    expect(fn).toBeCalled();
  });
});
