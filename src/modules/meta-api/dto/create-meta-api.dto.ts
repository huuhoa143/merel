import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  apiTypeEnums,
  methodTypeEnums,
} from '@/modules/meta-api/enums/meta-api.enum';

export class CreateMetaApiDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  apiType: apiTypeEnums;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  smartContractId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dappId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  methodType: methodTypeEnums;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  method: string;
}
