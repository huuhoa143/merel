import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    } as StrategyOptions);
  }

  // async validate(payload: JWTPayload): Promise<Merchant> {
  //   const merchant = await this.authService.getMerchantProfile(payload.sub);
  //   return merchant;
  // }
}
