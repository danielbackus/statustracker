import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  /*constructor(private readonly userService: UserService) {}*/

  async validateUser(token: string): Promise<any> {
    return null; // await this.userService.findOneByToken(token);
  }
}
