import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddNewChildDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dappId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  numberOfChildren: number;
}
