import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SessionAuthGuard } from '@/auth/guards/session-auth.guard';
import { MetaApiService } from '@/modules/meta-api/meta-api.service';
import { CreateMetaApiDto } from '@/modules/meta-api/dto/create-meta-api.dto';

@ApiTags('meta-api')
@Controller('meta-api')
export class MetaApiController {
  constructor(private readonly metaApiService: MetaApiService) {}

  @Post('/')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createMetaApiDto: CreateMetaApiDto) {
    await this.metaApiService.create(createMetaApiDto);
    return;
  }
}
