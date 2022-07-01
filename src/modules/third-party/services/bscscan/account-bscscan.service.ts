import { GetListTransactionParams } from './types/transaction.type';
import { Injectable } from '@nestjs/common';
import { BscScanService } from './bscscan.service';

// Official API documentation: https://docs.bscscan.com/api-endpoints/accounts
@Injectable()
export class AccountBscScanService extends BscScanService {
  private _module = 'account';
  private ACTIONS = {
    TXLIST: 'txlist',
  };

  constructor() {
    super();
  }

  async getTransactions(
    address: string,
    params: GetListTransactionParams,
  ): Promise<any> {
    const reqParams = {
      address,
      ...params,
    };
    const res = await this.doGet(this._module, this.ACTIONS.TXLIST, reqParams);
    return res.data.result;
  }
}
