import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { InviteDto } from './invite.dto';
import { CreateUserDto } from './create-user.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  async get() {
    return await this.userService.find();
  }

  @Post('login')
  async login(@Body() request: UserDto): Promise<object> {
    return await this.userService.login(request);
  }

  @Post()
  async create(@Body() request: CreateUserDto): Promise<void> {
    return await this.userService.create(request);
  }

  @Post('invite')
  @UseGuards(AuthGuard())
  async invite(@Body() request: InviteDto): Promise<void> {
    return await this.userService.invite(request);
  }

  @Get('invite')
  async getInvite(@Query() params): Promise<string> {
    return await this.userService.getInvite(params.invite);
  }

  @Post('forgot')
  async forgotPassword(@Body() request): Promise<void> {
    return await this.userService.forgotPassword(request.email);
  }

  @Post('reset')
  async resetPassword(@Body() request): Promise<void> {
    return await this.userService.resetPassword(request);
  }

  @Get('reset')
  async getByReset(@Query() params): Promise<object> {
    return await this.userService.getByReset(params.reset);
  }
}
