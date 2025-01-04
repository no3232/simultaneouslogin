import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userid: string, password: string) {
    const user = await this.usersService.findOne(userid);
    if (!user) {
      throw new UnauthorizedException('Invalid userid or password');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid userid or password');
    }

    const payload = { sub: user.id, username: user.userid };
    return {
      access_token: this.jwtService.sign(payload),
    };

    return user;
  }
}
