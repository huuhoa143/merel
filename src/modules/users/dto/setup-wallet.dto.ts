import { ApiProperty } from '@nestjs/swagger';

export class SetupWalletDto {
  @ApiProperty()
  wallets: [
    {
      currency: string;
      network: string;
      networkId: string;
      address: string;
    },
  ];
}
