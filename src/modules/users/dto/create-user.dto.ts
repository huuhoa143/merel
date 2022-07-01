import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { MatchConfirmPassword } from '@/common/decorators/match-password.decorator';
import { authProviders } from '@/auth/enums';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 24)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MatchConfirmPassword('password')
  confirmedPassword: string;

  @IsNumber()
  readonly provider: authProviders = authProviders.BASE;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Equals(1)
  agreeTerm: number;
}
