import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PublicService } from '@/modules/public/public.service';
import { ExecuteMetaTxApiDto } from '@/modules/public/dto/execute-meta-tx-api.dto';
import { ApiHeader } from '@nestjs/swagger';
import { FP_API_KEY_HEADER } from '@/common/constants/http-header';
import { ApiKeyAuthGuard } from '@/auth/guards/apikey-auth.guard';
import { DappScope } from '@/common/decorators/dapp.decorator';
import { Dapp } from '@/modules/dapps/entities/dapps.entity';

@Controller('')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @ApiHeader({
    name: FP_API_KEY_HEADER,
    description: 'Header Api Key',
  })
  @UseGuards(ApiKeyAuthGuard)
  @Post('meta-tx')
  @UseInterceptors(ClassSerializerInterceptor)
  async executeMetaTx(
    @DappScope() dapp: Dapp,
    @Body() executeMetaTxApiDto: ExecuteMetaTxApiDto,
  ) {
    return await this.publicService.executeMetaTx(executeMetaTxApiDto, dapp);
  }

  @ApiHeader({
    name: FP_API_KEY_HEADER,
    description: 'Header Api Key',
  })
  @UseGuards(ApiKeyAuthGuard)
  @Get('token-gas-price/:token')
  @UseInterceptors(ClassSerializerInterceptor)
  async getTokenGasPrice(
    @DappScope() dapp: Dapp,
    @Param('token') token: string,
  ) {
    return await this.publicService.getTokenGasPrice(token, dapp);
  }
}
