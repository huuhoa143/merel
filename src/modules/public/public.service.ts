import { Injectable, Logger } from '@nestjs/common';
import { ExecuteMetaTxApiDto } from '@/modules/public/dto/execute-meta-tx-api.dto';
import { MetaApiService } from '@/modules/meta-api/meta-api.service';
import { SmartContractService } from '@/modules/smart-contract/smart-contract.service';
import {
  checkIsToken,
  convertToWei,
  getGasPrice,
  getTokenBalance,
  getTokenInfo,
  getTokenPriceInNativeToken,
  initContractInstance,
} from '@/common/utility/smart-contract/common.utility';
import { DappsService } from '@/modules/dapps/dapps.service';
import { SettingsService } from '@/modules/settings/settings.service';
import { Dapp } from '@/modules/dapps/entities/dapps.entity';
import BigNumber from 'bignumber.js';
import ERC20_ABI from '@/common/utility/smart-contract/ERC20_ABI.json';
import { PurseService } from '@/modules/purse/purse.service';
import { RelayerTxnService } from '@/modules/relayer-txn/relayer-txn.service';
import { RelayerTxnEnums } from '@/modules/relayer-txn/relayer-txn.enums';

@Injectable()
export class PublicService {
  private readonly logger = new Logger(PublicService.name);

  constructor(
    private readonly metaApiService: MetaApiService,
    private readonly smartContractService: SmartContractService,
    private readonly dappsService: DappsService,
    private readonly settingsService: SettingsService,
    private readonly purseService: PurseService,
    private readonly relayerTxnService: RelayerTxnService,
  ) {}

  async getTokenGasPrice(tokenAddress: string, dapp: Dapp) {
    const provider = await this.settingsService.getNetworkProvider(
      dapp.networkId,
    );

    const gasPrice = await getGasPrice(provider);
    const { name, decimals, symbol } = await getTokenInfo(
      provider,
      tokenAddress,
      ERC20_ABI,
    );

    const nativeTokenCMCId = await this.settingsService.getNativeTokenCMCId(
      dapp.networkId,
    );

    const tokenPriceInNativeToken = await getTokenPriceInNativeToken(
      nativeTokenCMCId,
      name,
      decimals,
    );
    const decimalPow = new BigNumber(10).pow(decimals);

    return new BigNumber(gasPrice)
      .multipliedBy(decimalPow)
      .dividedBy(tokenPriceInNativeToken)
      .toFixed();
  }

  async executeMetaTx(executeMetaTxApiDto: ExecuteMetaTxApiDto, dapp: Dapp) {
    const { from, to, apiId, params } = executeMetaTxApiDto;
    const metaApi = await this.metaApiService.findById(apiId);

    if (!metaApi) {
      throw new Error('META_API.META_API_NOT_FOUND');
    }

    const { smartContractId } = metaApi;
    const smartContract = await this.smartContractService.findByIdAndDappId(
      smartContractId,
      dapp.id.toString(),
    );

    if (!smartContract) {
      throw new Error('SMART_CONTRACT.SMART_CONTRACT_NOT_FOUND');
    }

    const provider = await this.settingsService.getNetworkProvider(
      dapp.networkId,
    );

    this.logger.log(
      `Execute meta tx with apiId: ${apiId}, dappId: ${dapp.id} and provider: ${provider}`,
    );

    const { method } = metaApi;
    const { address: contractAddress, abi } = smartContract;
    const ABI = JSON.parse(abi);

    const toAddressIsTokenAddress = await checkIsToken(provider, ABI, to);
    if (toAddressIsTokenAddress) {
      let tokenBalance = await getTokenBalance(provider, from, to, ABI);

      tokenBalance = convertToWei(tokenBalance, 18);
      if (new BigNumber(tokenBalance).isEqualTo('0')) {
        throw new Error('USER.TOKEN_BALANCE_IS_ZERO');
      }
    }
    const { contractInstance } = initContractInstance(
      provider,
      ABI,
      contractAddress,
    );

    this.smartContractService.validateParams(ABI, params, method);
    const functionSignature =
      await this.smartContractService.getFunctionSignature(
        contractInstance,
        method,
        params,
      );
    const tx = { to, data: functionSignature };
    const { txHash, gasPrice, gasLimit } = await this.purseService.sendTx(
      dapp.purse,
      tx,
      from,
    );

    await this.relayerTxnService.create({
      from,
      to,
      status: RelayerTxnEnums.SUCCESS,
      method,
      smartContractId,
      dappId: dapp.id,
      txHash,
      gasPrice,
      gasLimit,
    });

    return { transactionHash: txHash, gasPrice, gasLimit };
  }
}
