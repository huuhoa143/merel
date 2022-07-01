import { MerchantScope } from '@/common/decorators/merchant.decorator';

import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyService } from './api-keys.service';
import { SessionAuthGuard } from '@/auth/guards/session-auth.guard';

@ApiTags('api-key')
@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post('')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async createAPIKey(@MerchantScope() merchant) {
    return await this.apiKeyService.createApiKey(merchant);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async removeAPIKey(@Param('id') id: string) {
    await this.apiKeyService.removeApiKey(id);
    return {
      message: 'success',
    };
  }

  @Get('')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getAll(@MerchantScope() merchant) {
    return await this.apiKeyService.getAllApiKeys(merchant.id.toString());
  }
}
