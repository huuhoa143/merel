import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '@/modules/users/entities/users.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UserScope } from '@/common/decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: LoginDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@UserScope() user: User) {
    return await this.authService.login(user);
  }

  @Post('logout')
  async logout(@Request() req) {
    return await this.authService.logout(req);
  }
}
