import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Request() req) {
    return await this.usersService.findOne(req.user.username);
  }
}
