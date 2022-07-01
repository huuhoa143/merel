import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { apiTypeEnums } from '@/modules/meta-api/enums/meta-api.enum';

export class ExecuteMetaTxApiDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  apiId: apiTypeEnums;

  @ApiProperty()
  @IsNotEmpty()
  params: Array<any>;
}
