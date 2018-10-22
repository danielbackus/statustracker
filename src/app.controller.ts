import { Get, Controller, Render, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @Get()
  @UseGuards(AuthGuard())
  @Render('public/index.html')
  root() {}
}
