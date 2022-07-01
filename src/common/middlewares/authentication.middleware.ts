import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException('AUTH.AUTH_ERROR');
    const sessionId = token.split(' ')[1];
    if (!sessionId) throw new UnauthorizedException('AUTH.AUTH_ERROR');
    next();
  }
}
