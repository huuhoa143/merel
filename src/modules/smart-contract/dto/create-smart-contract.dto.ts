import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  metaTransactionTypeEnums,
  smartContractTypeEnums,
} from '@/modules/smart-contract/enums/smart-contract.enum';

export class CreateSmartContractDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  abi: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dappId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  metaTransactionType: metaTransactionTypeEnums;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: smartContractTypeEnums;
}
