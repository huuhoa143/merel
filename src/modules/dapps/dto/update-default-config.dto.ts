import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDefaultConfigDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dappId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  baseFundValue: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  minChildBalance: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  masterWalletThreshold: string;
}
