import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { parse } from 'cookie';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookie = request.headers.cookie;
          if (!cookie) return null;
          try {
            const parsedCookie = parse(cookie);
            return parsedCookie['access_token'] || null;
          } catch (error) {
            return null;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'test',
      passReqToCallback: true,
      timeout: 100000000,
    });
  }

  async validate(request: Request, payload: any) {
    // 요청 헤더에서 토큰 추출
    const cookie = request.headers.cookie;

    const parsedCookie = parse(cookie);
    const token = parsedCookie['access_token'];

    // Redis에서 토큰 검증
    const isValid = await this.authService.validateToken(payload.sub, token);

    if (!isValid) {
      throw new UnauthorizedException('Invalid token or session expired');
    }

    return { userId: payload.sub, username: payload.username };
  }
}
