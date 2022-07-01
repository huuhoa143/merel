import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ required: true, description: 'Email Of Merchant' })
  email: string;
  @ApiProperty({ required: true, description: 'Password Of Merchant' })
  password: string;
  @ApiProperty({ required: false, description: '2FA code' })
  authCode: string;
}
