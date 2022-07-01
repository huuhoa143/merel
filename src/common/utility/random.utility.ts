import BN from 'bignumber.js';
import Web3 from 'web3';

export function stringToBN(str, base = 10) {
  return new BN(str, base);
}

export function numberToBN(num) {
  return new BN(num);
}

export function bufferToHex(buf) {
  return `0x${buf.toString('hex')}`;
}

export function hexToString(hex) {
  return Buffer.from(hex.slice(2), 'hex').toString();
}

export function getBIP44Path(idx) {
  return `m/44'/60'/${idx}'/0`;
}

export async function tick(wait = 1000) {
  return new Promise((resolve) => setTimeout(() => resolve(true), wait));
}

export function isArrayOfFunctions(arr) {
  if (!(arr instanceof Array)) {
    return false;
  }
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== 'function') {
      return false;
    }
  }
  return true;
}

export function sendRawTransaction(
  web3: Web3,
  rawTx: string,
  handleTransactionHash?: (hash: string) => void,
) {
  return new Promise(async (resolve, reject) => {
    try {
      return web3.eth.sendSignedTransaction(
        rawTx,
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
                  resolve(hash);
                }
              });
            }, 1000);
          } else {
            console.log(
              'Something went wrong while submitting your transaction:',
              error,
            );
            reject(error);
          }
        },
      );
    } catch (err) {
      reject(err);
    }
  });
}
