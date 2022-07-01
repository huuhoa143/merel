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
import { SmartContractService } from '@/modules/smart-contract/smart-contract.service';
import { CreateSmartContractDto } from '@/modules/smart-contract/dto/create-smart-contract.dto';

@ApiTags('smart-contract')
@Controller('smart-contract')
export class SmartContractController {
  constructor(private readonly smartContractService: SmartContractService) {}

  @Post('/')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createSmartContractDto: CreateSmartContractDto) {
    await this.smartContractService.create(createSmartContractDto);
    return;
  }
}
