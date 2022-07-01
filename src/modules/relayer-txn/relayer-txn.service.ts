import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RelayerTxnRepository } from '@/modules/relayer-txn/relayer-txn.repository';
import { RelayerTxns } from '@/modules/relayer-txn/entities/relayer-txn.entity';
import { RelayerTxnEnums } from '@/modules/relayer-txn/relayer-txn.enums';

@Injectable()
export class RelayerTxnService {
  private readonly logger = new Logger(RelayerTxnService.name);

  constructor(private readonly relayerTxnRepository: RelayerTxnRepository) {}

  async create(arg: {
    from: string;
    to: string;
    status: RelayerTxnEnums;
    method: string;
    smartContractId: string;
    dappId: string;
    txHash: string;
    gasPrice: string;
    gasLimit: string;
  }) {
    const findRelayerTxn = await this.relayerTxnRepository.findOne({
      txHash: arg.txHash,
    });
    if (findRelayerTxn) {
      throw new NotFoundException('RELAYER_TXN.RELAYER_TXN_ALREADY_EXIST');
    }

    const relayerTxns = new RelayerTxns();
    relayerTxns.from = arg.from;
    relayerTxns.to = arg.to;
    relayerTxns.status = arg.status;
    relayerTxns.method = arg.method;
    relayerTxns.smartContractId = arg.smartContractId;
    relayerTxns.txHash = arg.txHash;
    relayerTxns.dappId = arg.dappId;
    relayerTxns.gasPrice = arg.gasPrice;
    relayerTxns.gasLimit = arg.gasLimit;
    await this.relayerTxnRepository.saveRelayerTxns(relayerTxns);
  }
}
