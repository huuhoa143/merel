import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import configuration from '@/config/configuration';
import { CustomErrorMessage } from '@/common/constants/error-message';

export const initWeb3 = (provider: string): Web3 => {
  return new Web3(provider);
};

export const initContractInstance = (
  provider: string,
  abi: Array<any>,
  contractAddress: string,
) => {
  const web3 = initWeb3(provider);

  const contractInstance = new web3.eth.Contract(
    abi as AbiItem[],
    contractAddress,
  );

  return { web3, contractInstance };
};

export const createNewWallet = (provider: string, password: string) => {
  const web3 = new Web3(provider);
  const account = web3.eth.accounts.create(password);
  return {
    address: account.address,
    privateKey: account.privateKey,
  };
};

export const getNativeBalance = async (provider: string, address: string) => {
  const web3 = new Web3(provider);
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance, 'ether');
};

export const getTokenBalance = async (
  provider: string,
  address: string,
  tokenAddress: string,
  tokenAbi: Array<any>,
) => {
  const { contractInstance } = initContractInstance(
    provider,
    tokenAbi,
    tokenAddress,
  );
  return contractInstance.methods.balanceOf(address).call();
};

export const convertToWei = (amount: string, decimal: number) => {
  const decimalPow = new BigNumber(10).pow(decimal);
  return new BigNumber(amount)
    .multipliedBy(decimalPow)
    .integerValue(BigNumber.ROUND_DOWN)
    .toFixed();
};

export const checkIsToken = (
  provider: string,
  tokenAbi: Array<any>,
  tokenAddress: string,
) => {
  try {
    const { contractInstance } = initContractInstance(
      provider,
      tokenAbi,
      tokenAddress,
    );
    const symbol = contractInstance.methods.symbol().call();
    if (symbol) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const getTokenInfo = async (
  provider: string,
  tokenAddress: string,
  tokenAbi: Array<any>,
) => {
  const { contractInstance } = initContractInstance(
    provider,
    tokenAbi,
    tokenAddress,
  );
  const name = contractInstance.methods.name().call();
  const symbol = contractInstance.methods.symbol().call();
  const decimals = contractInstance.methods.decimals().call();
  return {
    name,
    symbol,
    decimals,
  };
};

export const getTokenDecimal = async (
  provider: string,
  tokenAddress: string,
  tokenAbi: Array<any>,
) => {
  const { contractInstance } = initContractInstance(
    provider,
    tokenAbi,
    tokenAddress,
  );
  return contractInstance.methods.decimals().call();
};

export const getGasPrice = async (provider: string) => {
  const web3 = new Web3(provider);
  return web3.eth.getGasPrice();
};

export async function getUsdPriceFor(cryptoCMCIds: string): Promise<{
  errorCode: number;
  message: string;
  data: any;
}> {
  let response = null;
  try {
    response = await axios.get(
      `${configuration().coinMarketCap.apiUrl}=${cryptoCMCIds}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': configuration().coinMarketCap.apiKey,
        },
      },
    );
  } catch (ex) {
    if (ex.response && ex.response.data && ex.response.data.status) {
      const status = ex.response.data.status;
      console.warn(
        `Exception on getting CMC price for ${cryptoCMCIds}: ${status.error_code}, errorMessage: ${status.error_message}`,
      );
      // throw new InternalServerErrorException('PRICING.CMC_RESPONDED_NONE');
      return {
        errorCode: status.error_code,
        message: status.error_message,
        data: undefined,
      };
    }
    console.warn(
      `Error on getting USD price for ${cryptoCMCIds}: "${ex.message}"`,
    );
    return { errorCode: -1, message: ex.message, data: undefined };
    // throw new InternalServerErrorException(ex.message);
  }
  if (response) {
    const res = response.data;
    if (res.status) {
      if (res.status.error_code == 0) {
        // Everything is OK
        return { errorCode: 0, message: 'OK', data: res.data };
        // return res.data;
      } else {
        console.warn(
          `getUsdPriceFor errorCode: ${res.status.error_code}, errorMessage: ${res.status.error_message}`,
        );
        // throw new InternalServerErrorException('PRICING.CMC_RESPONDED_NONE');
        return {
          errorCode: res.status.error_code,
          message: res.status.error_message,
          data: undefined,
        };
      }
    } else {
      console.warn(`Coinmarketcap did not return status`);
      return {
        errorCode: -1,
        message: CustomErrorMessage['PRICING.CMC_RESPONDED_NONE'].description,
        data: undefined,
      };
      // throw new InternalServerErrorException('PRICING.CMC_RESPONDED_NONE');
    }
  }
  console.warn(`Coinmarketcap return NONE`);
  return {
    errorCode: -1,
    message: CustomErrorMessage['PRICING.CMC_RESPONDED_NONE'].description,
    data: undefined,
  };
  // throw new InternalServerErrorException('PRICING.CMC_RESPONDED_NONE');
}

export const getTokenPrice = async (cmdId: string) => {
  const res = await getUsdPriceFor(cmdId);
  if (!res || !res.data) {
    console.log(`getUsdPriceFor return NONE`);
    return;
  }
  const cryptoData = res.data[cmdId];
  return cryptoData.quote.USD.price;
};

export const getTokenPriceInNativeToken = async (
  nativeTokenCMCId: string,
  tokenName: string,
  tokenDecimal: number,
  tokenCMCId?: string,
) => {
  let tokenPrice = new BigNumber(1);
  const nativeTokenPrice = await getTokenPrice(nativeTokenCMCId);
  if (tokenName !== 'FiFood') {
    tokenPrice = new BigNumber(await getTokenPrice(tokenCMCId));
  }
  const decimalPow = new BigNumber(10).pow(tokenDecimal);
  return tokenPrice.multipliedBy(decimalPow).dividedBy(nativeTokenPrice);
};
