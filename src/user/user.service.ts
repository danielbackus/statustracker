import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { v4 } from 'uuid';
import { InviteDto } from './invite.dto';
import { Invite } from './invite.entity';
import { CreateUserDto } from './create-user.dto';
import { InviteRepository } from './invite.repository';
import { UserRepository } from './user.repository';
import * as mail from '@sendgrid/mail';
mail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    @InjectRepository(Invite)
    private readonly inviteRepository: InviteRepository,
  ) {}

  async validateUser(token: string) {
    const user: User = await this.userRepository.findByBearer(token);
    if (user && user.active) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async login(request: UserDto) {
    const { email, password } = request;
    const user: User = await this.userRepository.findOne({ email });
    if (
      user &&
      user.active &&
      (await bcrypt.compare(password, user.password))
    ) {
      user.bearer = await v4();
      await this.userRepository.save(user);
      return { id: user.id, bearer: user.bearer };
    }
    throw new UnauthorizedException();
  }

  notExpired(timestamp: Date): boolean {
    const d = new Date();
    d.setHours(d.getHours() - 1);
    return timestamp > d;
  }

  async create(request: CreateUserDto) {
    const invite: Invite = await this.inviteRepository.findOne(request.invite);
    if (!invite) throw new UnauthorizedException('Invite is not valid.');
    const user: User = await this.userRepository.create({
      email: invite.email,
      password: await bcrypt.hash(
        request.password,
        process.env.BCRYPT_SALT_ROUNDS || 10,
      ),
      creator: invite.creator,
    });
    await this.userRepository.save(user);
    await this.inviteRepository.delete(invite.id);
    return;
  }

  async find() {
    return await this.userRepository.find();
  }

  async invite(request: InviteDto) {
    const exists: Invite = await this.userRepository.findOne({
      email: request.email,
    });
    if (exists) return;
    const old = await this.inviteRepository.findOne({ email: request.email });
    if (old) await this.inviteRepository.remove(old);
    const creator: User = await this.userRepository.findOne(request.creator);
    const invite: Invite = await this.inviteRepository.create({
      email: request.email,
      creator,
    });
    await this.inviteRepository.save(invite);
    try {
      await this.sendInvite(invite, creator);
    } catch (e) {
      await this.inviteRepository.remove(invite);
      throw e;
    }
    return;
  }

  async sendInvite(invite: Invite, creator: User) {
    const message = {
      to: invite.email,
      from: 'noreply@concentrix.com',
      subject: `You have been invited by ${
        creator.email
      } to create a StatusTracker account`,
      text: `Please complete account registration at http://${
        process.env.HOST
      }/register.html?invite=${invite.id}`,
      html: `<p>Please complete account registration at <a href="http://${
        process.env.HOST
      }/register.html?invite=${invite.id}">http://${
        process.env.HOST
      }/register.html?invite=${invite.id}</a></p>`,
    };
    await mail.send(message);
    return;
  }

  async forgotPassword(email: string) {
    if (!email) throw new BadRequestException();
    const user: User = await this.userRepository.findOne({ email });
    if (user) {
      user.reset = v4();
      await this.userRepository.save(user);
      await this.sendForgot(user);
    }
    return;
  }

  async resetPassword(request) {
    const { reset, password } = request;
    const user: User = await this.userRepository.findOne({ reset });
    if (!user) throw new BadRequestException();
    user.password = await bcrypt.hash(
      password,
      process.env.BCRYPT_SALT_ROUNDS || 10,
    );
    user.reset = null;
    await this.userRepository.save(user);
    return;
  }

  async sendForgot(user: User) {
    const message = {
      to: user.email,
      from: `noreply@concentrix.com`,
      subject:
        'Password reset for your Status Tracker account has been requested',
      text: `A password reset for your account has been requested. If you wish to reset your password, you can use the following link to reset your password: http://${
        process.env.HOST
      }/reset.html?reset=${user.reset}`,
      html: `<p>
        A password reset for your account has been requested.
        If you wish to reset your password, you can use the following link to reset your password:
        <a href="http://${process.env.HOST}/reset.html?reset=${user.reset}">
        http://${process.env.HOST}/reset.html?reset=${user.reset}
        </a>
      </p>`,
    };
    await mail.send(message);
    return;
  }

  async getByReset(reset: string): Promise<object> {
    const user: User = await this.userRepository.findOne({ reset });
    if (!user) return;
    return { id: user.id, email: user.email };
  }

  async getInvite(id: string): Promise<string> {
    const invite: Invite = await this.inviteRepository.findOne(id);
    if (!invite) throw new UnauthorizedException();
    return invite.email;
  }
}
