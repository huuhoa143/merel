import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/modules/users/entities/users.entity';
import { hashMatching } from '@/common/utility/hash.utility';
import { ObjectID } from 'mongodb';
import { nanoid } from 'nanoid';
import { SessionService } from '@/modules/sessions/sessions.service';

export interface JWTPayload {
  id: ObjectID;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  async validateUser(email, password): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('AUTH.INCORRECT_EMAIL_OR_PASSWORD');
    }
    if (user) {
      const isPasswordMatched = await hashMatching(password, user.password);
      if (!isPasswordMatched) {
        throw new BadRequestException('AUTH.INCORRECT_EMAIL_OR_PASSWORD');
      }
      if (isPasswordMatched) {
        return user;
      }
    }
    throw new ForbiddenException('AUTH.ACCOUNT_NOT_ACTIVATED');
  }

  async login(user: User) {
    const { id, email } = user;
    const sessionId = nanoid(40);
    const payload: JWTPayload = {
      id,
      email,
    };
    const accessToken = this.jwtService.sign(payload);
    const savedSession = await this.sessionService.createSession({
      accessToken,
      sessionId,
      user: user.id,
    });
    if (!savedSession)
      throw new InternalServerErrorException('MEREL.INTERNAL_SERVER_ERROR');
    return {
      user,
      accessToken: sessionId,
    };
  }

  /**
   * Get AccessToken By SessionId
   * @returns {User}
   * @param sessionId
   */
  async getUserBySession(sessionId: string): Promise<User> {
    const session = await this.sessionService.findBySessionId(sessionId);
    if (!session) {
      throw new NotFoundException('AUTH.SESSION_NOT_FOUND');
    } else {
      const accessToken = session.accessToken;
      return this.jwtService.verify(accessToken);
    }
  }

  async logout(req: Request) {
    const token = req.headers['authorization'].split(' ');
    if (!token && token.length < 1)
      throw new UnauthorizedException('AUTH.AUTH_ERROR');
    await this.sessionService.deleteSession(token[1]);
    return {};
  }
}
