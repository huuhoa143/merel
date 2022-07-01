import BigNumber from 'bignumber.js';
import axios from 'axios';

const getGasPrice = async () => {
  const url = `https://ethgasstation.info/api/ethgasAPI.json?api-key=${process.env.GASSTATION_API_KEY}`;
  const response = await axios.get(url);
  return response.data.fast / 10;
};

export const convertToWei = (amount, decimal) => {
  const decimalPow = new BigNumber(10).pow(decimal);
  return new BigNumber(amount)
    .multipliedBy(decimalPow)
    .integerValue(BigNumber.ROUND_DOWN)
    .toFixed();
};

export const convertFromWei = (amount, decimal) => {
  const decimalPow = new BigNumber(10).pow(decimal);
  return new BigNumber(amount).dividedBy(decimalPow).toFixed();
};

export const estimateGasPriceInEIP1599 = async (web3, network) => {
  const newGasPrice = await getGasPrice();
  const maxPriorityFeePerGas = await web3.eth.getMaxPriorityFeePerGas();
  const maxFeePerGas = web3.utils.toWei(newGasPrice.toString(), 'gwei');
  const { baseFeePerGas } = await web3.eth.getBlock('pending');
  return {
    gasPrice: new BigNumber(
      network.includes('rinkeby') ? baseFeePerGas * 5 : baseFeePerGas,
    )
      .plus(maxPriorityFeePerGas)
      .toString(),
    maxPriorityFeePerGas,
    maxFeePerGas,
  };
};

export const estimateGasLimitVsGasPrice = async (
  web3,
  fromAddress,
  toAddress,
  data,
) => {
  const gasLimit = await web3.eth.estimateGas({
    from: fromAddress,
    to: toAddress,
    data,
  });
  const gasPrice = await web3.eth.getGasPrice();
  return { gasLimit, gasPrice };
};

const createDetail = async (
  web3,
  data,
  address,
  contractAddress,
  value = 0,
  network,
) => {
  const nonce = await web3.eth.getTransactionCount(address, 'latest');
  const detail = {
    from: address,
    to: contractAddress,
    value: value !== 0 ? web3.utils.toWei(value.toString(), 'ether') : 0,
    data,
    nonce,
    gas: 0,
    gasPrice: 0,
  };

  const { gasLimit, gasPrice } = await estimateGasLimitVsGasPrice(
    web3,
    address,
    contractAddress,
    data,
  );
  detail.gas = gasLimit;
  detail.gasPrice = gasPrice;

  return detail;
};

const signTransaction = async (
  web3,
  detail,
  privateKey,
  handleTransactionHash?: (hash: string) => void,
) => {
  const signedTransaction = await web3.eth.accounts.signTransaction(
    detail,
    privateKey,
  );
  console.log('Sign transaction thành công');
  return web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction,
    async function (error, hash) {
      if (!error) {
        console.log('Transaction has receive: !', hash);
        if (handleTransactionHash) {
          await handleTransactionHash(hash);
        }
        const startTime = new Date().getTime();
        console.log('Start time: ', new Date());
        const interval = setInterval(function () {
          web3.eth.getTransactionReceipt(hash, function (err, rec) {
            if (rec) {
              const endTime = new Date().getTime();
              console.log('Total Time: ', endTime - startTime);
              clearInterval(interval);
            }
          });
        }, 1000);
      } else {
        console.log(
          'Something went wrong while submitting your transaction:',
          error,
        );
      }
    },
  );
};

async function waitPendingTransaction(web3, address: string) {
  let timeout = 0;
  while (timeout < parseInt(process.env.TRANSACTION_TIMEOUT)) {
    const latestNonce = await web3.eth.getTransactionCount(address, 'latest');
    const pendingNonce = await web3.eth.getTransactionCount(address, 'pending');
    if (pendingNonce - latestNonce === 0) return;
    if (pendingNonce - latestNonce > 0) timeout += 1000;
  }
  throw new Error('BLOCKCHAIN.TIMEOUT_PENDING_TRANSACTION');
}

export async function sendSignTransaction(
  web3,
  data,
  adminAddress,
  privateKey,
  contractAddress,
  network = 'binance-smart-chain',
  handleTransactionHash?: (hash: string) => void,
) {
  console.log('Wait pending transaction');
  await waitPendingTransaction(web3, adminAddress);
  console.log('Done start sign and submit transaction');
  const detail = await createDetail(
    web3,
    data,
    adminAddress,
    contractAddress,
    0,
    network,
  );
  console.log('Tạo detail transaction thành công');
  return signTransaction(web3, detail, privateKey, handleTransactionHash);
}

// const approve = async (
//   web3,
//   contractAddress,
//   abi,
//   address,
//   approvedAddress,
//   privateKey,
// ) => {
//   const contractInstance = new web3.eth.Contract(abi, contractAddress);
//   const allowance = await contractInstance.methods
//     .allowance(address, approvedAddress)
//     .call();
//   if (allowance > 0) return;
//   const nonce = await web3.eth.getTransactionCount(address);
//   const data = contractInstance.methods
//     .approve(approvedAddress, maxUInt)
//     .encodeABI();

//   const details = {
//     from: address,
//     to: contractAddress,
//     value: 0,
//     data: data,
//     nonce: nonce,
//   };
//   const gasLimit = await web3.eth.estimateGas({
//     from: address,
//     to: contractAddress,
//     data,
//   });
//   const gasPrice = await web3.eth.getGasPrice();
//   details['gas'] = gasLimit;
//   details['gasPrice'] = gasPrice;

//   const signedTransaction = await web3.eth.relayer-txn.signTransaction(
//     details,
//     privateKey,
//   );

//   await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
//   console.log(
//     'Finish approve %s token of contract %s from address %s with tx_id = %s',
//     contractAddress,
//     address,
//   );
// };
