import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_REPOSITORY } from '../domain/interfaces/user.repository.interface';
import type { IUserRepository } from '../domain/interfaces/user.repository.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (() => {
        const secret = process.env.JWT_SECRET;
        if (!secret && process.env.NODE_ENV === 'production') {
          throw new Error('JWT_SECRET must be defined in production!');
        }
        return secret || 'secretKey';
      })(),
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // This will be attached to Req.user
  }
}
