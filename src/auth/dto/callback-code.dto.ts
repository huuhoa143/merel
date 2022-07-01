import { ApiProperty } from '@nestjs/swagger';

export class CallBackCode {
  @ApiProperty({
    required: true,
    description: 'Secret Code Of Oauth2 Provider',
  })
  code: string;
}
