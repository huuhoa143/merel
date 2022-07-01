import { Injectable } from '@nestjs/common';
import axios from 'axios';

// Official API documentation: https://docs.bscscan.com/
@Injectable()
export class BscScanService {
  private API_URL = process.env.BSCSCAN_API_URL;
  private API_KEY = process.env.BSCSCAN_API_KEY;
  private _baseParams = {};

  constructor() {
    this._baseParams = {
      apikey: this.API_KEY,
    };
  }

  private _getParams(params: any, module, action): any {
    return {
      ...this._baseParams,
      ...params,
      module,
      action,
    };
  }

  protected async doGet(
    module: string,
    action: string,
    params: any,
  ): Promise<any> {
    const reqParams = this._getParams(params, module, action);

    const url = `${this.API_URL}/api`;
    return await axios.get(url, {
      params: reqParams,
    });
  }
}
