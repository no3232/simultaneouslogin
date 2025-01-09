import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async login(userid: string, password: string) {
    const user = await this.usersService.findOne(userid);
    if (!user) {
      throw new UnauthorizedException('Invalid userid or password');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid userid or password');
    }

    // 기존 토큰이 있다면 삭제 (중복 로그인 방지)
    const existingToken = await this.cacheManager.get(`auth:${user.id}`);
    if (existingToken) {
      await this.cacheManager.del(`auth:${user.id}`);
    }

    const payload = { sub: user.id, username: user.userid };
    const token = this.jwtService.sign(payload);

    // Redis에 새 토큰 저장 (24시간 유효)
    await this.cacheManager.set(`auth:${user.id}`, token, 24 * 60 * 60 * 1000);

    return {
      access_token: token,
    };
  }

  // 토큰 검증을 위한 메서드
  async validateToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.cacheManager.get(`auth:${userId}`);
    return token === storedToken;
  }

  // 로그아웃 시 토큰 삭제
  async logout(userId: string) {
    await this.cacheManager.del(`auth:${userId}`);
  }
}
