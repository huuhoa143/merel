import { EntityRepository, getMongoRepository, Repository } from 'typeorm';
import { RelayerTxns } from '@/modules/relayer-txn/entities/relayer-txn.entity';

@EntityRepository(RelayerTxns)
export class RelayerTxnRepository extends Repository<RelayerTxns> {
  saveRelayerTxns(relayerTxns: RelayerTxns): Promise<RelayerTxns> {
    return getMongoRepository(RelayerTxns).save(relayerTxns);
  }
}
