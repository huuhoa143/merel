import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelayerTxnRepository } from '@/modules/relayer-txn/relayer-txn.repository';
import { RelayerTxnService } from '@/modules/relayer-txn/relayer-txn.service';

@Module({
  imports: [TypeOrmModule.forFeature([RelayerTxnRepository])],
  providers: [RelayerTxnService],
  exports: [RelayerTxnService],
})
export class RelayerTxnModule {}
