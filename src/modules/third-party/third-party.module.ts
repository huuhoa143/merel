import { AccountBscScanService } from './services/bscscan/account-bscscan.service';
import { Module } from '@nestjs/common';
import { BscScanService } from './services/bscscan/bscscan.service';

@Module({
  controllers: [],
  providers: [BscScanService, AccountBscScanService],
  exports: [AccountBscScanService],
})
export class ThirdPartyModule {}
