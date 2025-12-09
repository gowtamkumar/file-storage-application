import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'super_secret_jwt_key_change_me',
    });
  }

  async validate(payload: any) {
    // payload.sub is the userId in our implementation
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    // Return the user object, which will be attached to Request object
    return { id: user.id, email: user.email, role: user.role };
  }
}
