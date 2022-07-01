import { Module } from '@nestjs/common';
import { MetaApiModule } from '@/modules/meta-api/meta-api.module';
import { PublicController } from '@/modules/public/public.controller';
import { PublicService } from '@/modules/public/public.service';
import { SmartContractModule } from '@/modules/smart-contract/smart-contract.module';
import { DappsModule } from '@/modules/dapps/dapps.module';
import { SettingsModule } from '@/modules/settings/settings.module';
import { PurseModule } from '@/modules/purse/purse.module';
import { RelayerTxnModule } from '@/modules/relayer-txn/relayer-txn.module';

@Module({
  imports: [
    MetaApiModule,
    SmartContractModule,
    DappsModule,
    SettingsModule,
    PurseModule,
    RelayerTxnModule,
  ],
  controllers: [PublicController],
  providers: [PublicService],
  exports: [PublicService],
})
export class PublicModule {}
