import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../../users.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { MerchantScope } from '@/common/decorators/merchant.decorator';
import { SessionAuthGuard } from '@/auth/guards/session-auth.guard';
import { PagingInterceptor } from '@/common/interceptors/paging-intercepter';
import { GetAllUserFilterDto } from '@/modules/users/dto/get-all-user-filter.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() createMerchantDto: CreateUserDto) {
    await this.usersService.register(createMerchantDto);
    return;
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor, PagingInterceptor)
  async getAllDapp(@Query('') getAllUserFilterDto: GetAllUserFilterDto) {
    return await this.usersService.getAllUser(getAllUserFilterDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getMyInfo(@MerchantScope() user) {
    return await this.usersService.getMyInfo(user.id);
  }
}
