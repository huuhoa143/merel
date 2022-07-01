import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    protected readonly authService: AuthService,
    protected readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) throw new UnauthorizedException('AUTH.AUTH_ERROR');
    const sessionId = token.split(' ')[1];
    if (!sessionId) throw new UnauthorizedException('AUTH.AUTH_ERROR');
    const merchant = await this.authService.getUserBySession(sessionId);
    // You can throw an exception based on either "info" or "err" arguments

    if (!merchant) {
      throw new UnauthorizedException('AUTH.AUTH_ERROR');
    }

    const findMerchant = await this.usersService.findById(merchant.id);

    if (!findMerchant) {
      throw new UnauthorizedException('AUTH.AUTH_ERROR');
    }

    request.user = merchant;
    return true;
  }
}
