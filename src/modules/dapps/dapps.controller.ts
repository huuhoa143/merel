import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DappsService } from '@/modules/dapps/dapps.service';
import { SessionAuthGuard } from '@/auth/guards/session-auth.guard';
import { MerchantScope } from '@/common/decorators/merchant.decorator';
import { CreateDappDto } from '@/modules/dapps/dto/create-dapp.dto';
import { PagingInterceptor } from '@/common/interceptors/paging-intercepter';
import { GetAllDappFilterDto } from '@/modules/dapps/dto/get-all-dapp-filter.dto';
import { UpdateDefaultConfigDto } from '@/modules/dapps/dto/update-default-config.dto';
import { AddNewChildDto } from '@/modules/dapps/dto/add-new-child.dto';

@ApiTags('dapps')
@Controller('dapps')
export class DappsController {
  constructor(private readonly dappsService: DappsService) {}

  @Post('/')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@MerchantScope() user, @Body() createDappDto: CreateDappDto) {
    await this.dappsService.create(createDappDto, user);
    return;
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor, PagingInterceptor)
  async getAllDapp(@Query('') getAllDappFilterDto: GetAllDappFilterDto) {
    return await this.dappsService.getAllDapp(getAllDappFilterDto);
  }

  @Put('default-config')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor, PagingInterceptor)
  async updateDefaultConfig(
    @Body() updateDefaultConfigDto: UpdateDefaultConfigDto,
  ) {
    return await this.dappsService.updateDefaultConfig(updateDefaultConfigDto);
  }

  @Post('add-new-child')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor, PagingInterceptor)
  async addNewChild(@Body() addNewChildDto: AddNewChildDto) {
    return await this.dappsService.addNewChild(addNewChildDto);
  }
}
