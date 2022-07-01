import BN from 'bignumber.js';

export const DEFAULT_MNEMONIC = 'one two three four five six';
export const DEFAULT_CHILDREN = 5;
export const DEFAULT_GAS_PRICE = new BN('5000000000', 10); // 5 gwei;
export const MAX_GAS_PRICE = new BN('100000000000', 10); // 100 gwei. Hopefully we'll never have to raise this again...
export const DEFAULT_MAX_PENDING_PER_ACCOUNT = 1;
export const BASE_FUND_VALUE = new BN('100000000000000000', 10); // 0.1 Ether
export const MASTER_WALLET_THRESHOLD = new BN('500000000000000000', 10); // 0.5 Ether
export const ZERO = new BN('0', 10);
export const MIN_CHILD_BALANCE = new BN('80000000000000000', 10); // 0.08 Ether
export const MAX_LOCK_TIME = 15000; // msec
export const ACCOUNT_ACQUISITION_TIMEOUT = 60000; // msec

// Redis constants
export const REDIS_TX_COUNT_PREFIX = 'txcount_';
export const REDIS_PENDING_KEY = `pending_txs_`;
export const REDIS_PENDING_PREFIX = `pending_tx_`;
export const REDIS_PENDING_TX_PREFIX = `pending_txobj_`;
