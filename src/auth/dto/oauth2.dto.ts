import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { User } from '@/modules/users/entities/users.entity';

export class SocialMerchantDto {
  @IsOptional()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsNotEmpty()
  @IsBoolean()
  verified: boolean;

  async toEntity(): Promise<User> {
    const user = new User();
    user.name = this.name;
    user.email = this.email;
    return user;
  }
}
