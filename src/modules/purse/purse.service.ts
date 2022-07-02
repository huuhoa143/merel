import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Web3 from 'web3';
import { Wallet } from 'ethers';
import {
  BASE_FUND_VALUE,
  DEFAULT_CHILDREN,
  DEFAULT_GAS_PRICE,
  DEFAULT_MNEMONIC,
  MASTER_WALLET_THRESHOLD,
  MAX_GAS_PRICE,
  MIN_CHILD_BALANCE,
} from '@/common/constants/defaults';
import {
  getBIP44Path,
  numberToBN,
  sendRawTransaction,
  stringToBN,
  tick,
} from '@/common/utility/random.utility';
import BN from 'bignumber.js';
import { PurseConfig, Purses } from '@/modules/purse/entities/purse.entity';
import { PursesRepository } from '@/modules/purse/purse.repository';
import { SettingsService } from '@/modules/settings/settings.service';
import {
  decryptPrivateKey,
  encryptPrivateKey,
} from '@/common/utility/hash.utility';

class Account {
  public txCount: any;
  public wallet: {
    publicKey: string;
    privateKey: string;
  };
  public locked: Date;
  public hasPendingFundingTx: boolean;

  constructor({ txCount, wallet }) {
    this.txCount = txCount;
    this.wallet = wallet;
    this.locked = null;
    this.hasPendingFundingTx = false;
  }
}

@Injectable()
export class PurseService implements OnModuleInit {
  private readonly logger = new Logger(PurseService.name);
  private readonly supportedChains: any;

  constructor(
    private readonly pursesRepository: PursesRepository,
    private readonly settingsService: SettingsService,
  ) {
    this.supportedChains = {};
  }

  async onModuleInit() {
    await this.initWeb3();
  }

  async initWeb3() {
    const chains = await this.settingsService.findAllSupportedChains();
    if (!chains || chains.length <= 0) {
      return;
    }
    for (const chain of chains) {
      const { currency, provider, transactionUrl, networkId } = chain;
      // HTTP providers
      const web3 = new Web3(provider);

      // Add new supported chain config for given network
      this.supportedChains[networkId] = {
        currency,
        provider,
        web3: web3,
        transactionUrl,
      };
    }
  }

  /**
   * Update the pending transaction count for an account
   * @param purse {Purses} - The purse to update
   * @param address {string} - The account address to update
   * @param txCount  {number} - The new pending transaction count
   */
  async updateTxCount(purse: Purses, address: string, txCount: number) {
    this._enforceExists(purse, address);
    purse.accounts[address].txCount = txCount;
    await this.pursesRepository.findAndUpdatePurseProperty(
      purse.id.toString(),
      {
        accounts: purse.accounts,
      },
    );
  }

  /**
   * Unlock child account for a given purse
   * @param purse {Purses} - The purse to unlock
   * @param address {string} - The account address to unlock
   * @returns {Promise<void>}
   */
  async unlockChild(purse: Purses, address: string) {
    this._enforceChild(purse, address);
    purse.accounts[address].locked = null;
    await this.pursesRepository.findAndUpdatePurseProperty(
      purse.id.toString(),
      {
        accounts: purse.accounts,
      },
    );
  }

  /**
   * Update has pending funding tx flag for an account
   * @param purse {Purses} - The purse to update
   * @param address {string} - The account address to update
   * @param hasPendingFundingTx {boolean} - The new value for the flag
   * @returns {Promise<void>}
   */
  async updateHasPendingFundingTx(
    purse: Purses,
    address: string,
    hasPendingFundingTx: boolean,
  ) {
    this._enforceChild(purse, address);
    purse.accounts[address].hasPendingFundingTx = hasPendingFundingTx;
    await this.pursesRepository.findAndUpdatePurseProperty(
      purse.id.toString(),
      {
        accounts: purse.accounts,
      },
    );
  }

  async findPurse(id: string) {
    const purse = await this.pursesRepository.findOne(id);
    if (!purse) {
      throw new Error('PURSE.PURSE_NOT_FOUND');
    }
    return purse;
  }

  /**
   * Create a new purse
   * @param networkId {string} - The network id to create the purse for
   * @param mnemonic {string} - The mnemonic to use to generate the wallet
   * @param childrenToCreate {number} - The number of children to create
   * @param autofundChildren {boolean} - Whether to autofund the children
   */
  async create(
    networkId: string,
    mnemonic = DEFAULT_MNEMONIC,
    childrenToCreate = DEFAULT_CHILDREN,
    autofundChildren = false,
  ) {
    console.log({ mnemonic });
    const purse = new Purses();
    purse.networkId = networkId;
    purse.mnemonic = encryptPrivateKey(mnemonic);
    purse.childrenToCreate = childrenToCreate;
    purse.autofundChildren = autofundChildren;
    purse.config = {
      baseFundValue: BASE_FUND_VALUE.toFixed(),
      minChildBalance: MIN_CHILD_BALANCE.toFixed(),
      masterWalletThreshold: MASTER_WALLET_THRESHOLD.toFixed(),
    };
    const masterWallet = Wallet.fromMnemonic(mnemonic);
    const masterAddress = masterWallet.address;
    const accounts = {};
    const children = [];
    accounts[masterAddress] = new Account({
      txCount: 0,
      wallet: {
        publicKey: masterAddress,
        privateKey: encryptPrivateKey(masterWallet.privateKey),
      },
    });
    this.logger.warn(`Initialized master key for account ${masterAddress}`);
    for (let i = 0; i < childrenToCreate; i++) {
      const childWallet = Wallet.fromMnemonic(mnemonic, getBIP44Path(i));
      const address = childWallet.address;

      children[i] = address;
      accounts[address] = new Account({
        txCount: 0,
        wallet: {
          publicKey: address,
          privateKey: encryptPrivateKey(childWallet.privateKey),
        },
      });

      this.logger.warn(`Initialized child account ${address}`);
    }

    purse.accounts = accounts;
    purse.children = children;

    purse.ready = true;
    purse.accountLookupInProgress = false;
    purse.masterWallet = {
      publicKey: masterWallet.address,
      privateKey: encryptPrivateKey(masterWallet.privateKey),
    };
    purse.checkBalances = true;

    // Transaction data, including the complete unsigned transaction objects
    // stored by hash.  See header for format
    purse.transactionMeta = {};
    return await this.pursesRepository.savePurses(purse);
  }

  /**
   * Update the config for a purse
   * @param purse {Purses} - The purse to update
   * @param config {PurseConfig} - The new config to use
   * @returns {Promise<void>}
   */
  async updateConfig(purse: Purses, config: PurseConfig) {
    return await this.pursesRepository.findAndUpdatePurseProperty(
      purse.id.toString(),
      {
        config,
      },
    );
  }

  /**
   * Create new child account to a purse
   * @param purse {Purses} - The purse to add the child to
   * @param numberOfChildren {number} - The number of children to create
   * @returns {Promise<void>}
   */
  async createNewChild(purse: Purses, numberOfChildren = 1) {
    const mnemonic = purse.mnemonic;
    const currentChildLength = purse.children.length;
    let newAccount = {};
    let children = [];
    for (let i = currentChildLength; i < numberOfChildren; i++) {
      const childWallet = Wallet.fromMnemonic(mnemonic, getBIP44Path(i));
      const address = childWallet.address;

      children[i] = address;
      newAccount[address] = new Account({
        txCount: 0,
        wallet: {
          publicKey: address,
          privateKey: encryptPrivateKey(childWallet.privateKey),
        },
      });

      this.logger.warn(`Initialized child account ${address}`);
    }
    children = purse.children.concat(children);
    newAccount = { ...purse.accounts, ...newAccount };
    await this.pursesRepository.findAndUpdatePurseProperty(
      purse.id.toString(),
      {
        children,
        accounts: newAccount,
      },
    );
    return;
  }

  // TODO: Drain all children balance back to the master wallet

  async getAllPurserReady() {
    return await this.pursesRepository.findAllPurseReady();
  }

  /**
   * Select an available account
   * @returns {string} address of the available account
   */
  async getAvailableAccount(purseId: string) {
    let resolvedAccount = null;
    let purse: Purses = null;
    do {
      purse = await this.findPurse(purseId);
      // We only want to be doing one lookup at a time
      if (purse.accountLookupInProgress) {
        this.logger.warn('Account lookup in progress, waiting...');
      } else {
        purse.accountLookupInProgress = true;
        this.logger.log('Turning on account lookup in progress');
        await this.pursesRepository.findAndUpdatePurseProperty(
          purse.id.toString(),
          {
            accountLookupInProgress: true,
          },
        );
        break;
      }
    } while (await tick());

    const minChildBalance = purse.config.minChildBalance
      ? purse.config.minChildBalance
      : MIN_CHILD_BALANCE;
    try {
      do {
        const sc = this.supportedChains[purse.networkId];
        for (const child of purse.children) {
          const childBal = stringToBN(await sc.web3.eth.getBalance(child));
          if (
            purse.accounts[child].locked === null &&
            childBal.gt(minChildBalance)
          ) {
            resolvedAccount = child;
            this.logger.log(`Selected account ${resolvedAccount}`);
            break;
          }
        }

        if (resolvedAccount) {
          purse.accounts[resolvedAccount].locked = new Date();
          break;
        } else {
          this.logger.warn(
            `No available accounts found, waiting for one to become available`,
          );
        }
      } while (await tick());
    } catch (err) {
      this.logger.error(`Error selecting account: ${err}`);
    }

    // Unlock the lookup process
    await this.pursesRepository.findAndUpdatePurseProperty(
      purse.id.toString(),
      {
        accountLookupInProgress: false,
        accounts: purse.accounts,
      },
    );

    return resolvedAccount;
  }

  /**
   * Sign a transaction using a specific child account
   * @param purse {Purses} the purse to use
   * @param address {string} - The address of the account to sign the tx
   * @param tx {object} - The transaction object
   * @returns {object} The signed transaction object from web3.js
   */
  async signTx(purse: Purses, address: string, tx) {
    this._enforceChild(purse, address);
    const sc = this.supportedChains[purse.networkId];
    const privKey = decryptPrivateKey(
      purse.accounts[address].wallet.privateKey,
    );
    return await sc.web3.eth.accounts.signTransaction(tx, privKey.slice(2));
  }

  /**
   * Send a transaction from an available sender account.
   *
   * NOTE: This does not wait for the transaction to be mined!
   *
   * @param purseId {string} - The purse to use
   * @param tx {object} - The transaction object, sans `from` and `nonce`
   * @param sender {string} - The address of the original sending account
   * @param onReceipt {function} - An optional callback to call when a receipt is found
   * @returns {{txHash: string, gasPrice: BN, gasLimit: BN}} The transaction hash and gas price with gas limit of the sent transaction
   */
  async sendTx(purseId: string, tx: any, sender: string, onReceipt?: any) {
    const purse = await this.findPurse(purseId);
    const address = await this.getAvailableAccount(purseId);
    const sc = this.supportedChains[purse.networkId];
    this.logger.log(
      `Sending transaction from ${address} to ${sc.web3.utils.toChecksumAddress(
        tx.to,
      )}`,
    );
    // Set the from and nonce for the account
    tx = {
      ...tx,
      to: sc.web3.utils.toChecksumAddress(tx.to),
      from: address,
      nonce: await this.txCount(purseId, address),
    };

    if (!tx.gasPrice) {
      tx.gasPrice = await this._getGasPrice(sc);
    }

    if (!tx.gas) {
      tx.gas = await this._getGasLimit(
        sc,
        address,
        tx.to,
        new BN('0'),
        tx.data,
      );
    }

    const gasPrice = new BN(tx.gasPrice);
    const gasLimit = new BN(tx.gas);

    const signed = await this.signTx(purse, address, tx);
    const rawTx = signed.rawTransaction;
    const txHash = sc.web3.utils.sha3(rawTx);

    try {
      // blast it
      await sendRawTransaction(sc.web3, rawTx, onReceipt);

      await this.incrementTxCount(purseId, address);

      this.logger.log(
        `Sent txHash: ${txHash} successfully with child account ${address}, gasPrice: ${gasPrice}, gasLimit: ${gasLimit}, nonce: ${tx.nonce}`,
      );
    } catch (err) {
      this.logger.error(`Error sending transaction ${txHash}`);
      throw err;
    }

    return {
      txHash,
      gasPrice: gasPrice.toString(),
      gasLimit: gasLimit.toString(),
    };
  }

  /**
   * Get the current transaction count for an account (includes known pending)
   * @param purseId {string} - The purse to get the transaction count for
   * @param address {string} - The account address to increment
   */
  async txCount(purseId: string, address: string) {
    const purse = await this.findPurse(purseId);
    // If we have one in database, go with that
    return purse.accounts[address] ? purse.accounts[address].txCount : 0;
  }

  /**
   * Get the gas limit to use for a transaction
   * @param supportedChains {object} - The supported chains
   * @param from {string} - from address
   * @param to {string} - to address
   * @param value {BN} - value bignumber
   * @param data {string} - data to send
   * @returns {BN} The gas limit in wei
   */
  async _getGasLimit(
    supportedChains: any,
    from: string,
    to: string,
    value: BN,
    data?: string,
  ): Promise<BN> {
    const gasLimit = await supportedChains.web3.eth.estimateGas({
      from,
      to,
      value: value.toFixed(),
      data: data ? data : '0x',
    });
    return numberToBN(gasLimit);
  }

  /**
   * Get the gas price to use for a transaction
   * @returns {BN} The gas price in wei
   */
  async _getGasPrice(supportedChains: any) {
    let gasPrice = DEFAULT_GAS_PRICE;
    try {
      const netGasPrice = stringToBN(
        await supportedChains.web3.eth.getGasPrice(),
      );
      if (netGasPrice) {
        gasPrice = netGasPrice;
      }
    } catch (e) {
      this.logger.error('Error occurred in _getGasPrice()');
    }
    if (gasPrice.gt(MAX_GAS_PRICE)) {
      throw new Error('PURSE.GAS_PRICE_TOO_HIGH');
    }
    return gasPrice;
  }

  /**
   * Fund a child account from the master wallet
   * @param purseId {string} - The purse to fund
   * @param address {string} - The account to fund
   * @param value {BN} - The amount to fund
   */
  async _fundChild(purseId: string, address: string, value: BN) {
    const purse = await this.findPurse(purseId);
    this._enforceChild(purse, address);
    if (value && !(value instanceof BN)) {
      throw new Error('PURSE.INVALID_PARAMETER');
    }

    if (
      purse.accounts[address] &&
      purse.accounts[address].hasPendingFundingTx
    ) {
      this.logger.warn(
        `Child ${address} already has a pending funding transaction. Skipping...`,
      );
      return;
    }

    // Update the account to have a pending funding transaction
    purse.accounts[address].hasPendingFundingTx = true;
    await this.pursesRepository.findAndUpdatePurseProperty(purseId, {
      accounts: purse.accounts,
    });

    const masterAddress = purse.masterWallet.publicKey;
    const masterPrivateKey = decryptPrivateKey(purse.masterWallet.privateKey);

    const fundingValue = value || BASE_FUND_VALUE;
    const supportedChains = this.supportedChains[purse.networkId];

    const gasPrice = await this._getGasPrice(supportedChains);
    const gasLimit = await this._getGasLimit(
      supportedChains,
      masterAddress,
      address,
      fundingValue,
    );
    const txCost = fundingValue.plus(gasPrice.multipliedBy(gasLimit));

    const masterBalance = stringToBN(
      await supportedChains.web3.eth.getBalance(masterAddress),
    );

    if (masterBalance.lt(txCost)) {
      this.logger.error(
        `Unable to fund child account because master account (${masterAddress}) does't have the funds!`,
      );
      return;
    }

    const unsigned = {
      nonce: await this.txCount(purseId, masterAddress),
      from: masterAddress,
      to: address,
      value: fundingValue.toString(),
      gas: gasLimit.toString(),
      gasPrice,
    };

    this.logger.log(
      `Sending ${fundingValue.toString()} (total cost: ${txCost.toFixed()}) from ${masterAddress} (bal: ${masterBalance}) (nonce: ${
        unsigned.nonce
      })`,
    );

    /**
     * If you don't do this specific buffer to hex conversion, you'll probably end up chasing an
     * error message that makes no sense.
     */
    const signedTransaction =
      await supportedChains.web3.eth.accounts.signTransaction(
        unsigned,
        masterPrivateKey.slice(2),
      );
    const rawTx = signedTransaction.rawTransaction;

    // The following isn't available in our pinned version of web3.js...
    // const txHash = signed.transactionHash
    // So we hash it ourself...
    const txHash = supportedChains.web3.utils.sha3(rawTx);

    try {
      await sendRawTransaction(supportedChains.web3, rawTx);

      this.logger.log(`Add Pending Transaction: ${txHash} successfully`);
      await this.incrementTxCount(purse.id.toString(), address);
      this.logger.log(`Increment tx count: ${txHash} successfully`);

      this.logger.log(
        `Successfully funded child account ${address}, txHash: ${txHash}`,
      );
    } catch (e) {
      this.logger.error(
        `Error funding child account ${address}, txHash: ${txHash}`,
      );
    }

    purse.accounts[address].hasPendingFundingTx = false;
    await this.pursesRepository.findAndUpdatePurseProperty(purseId, {
      accounts: purse.accounts,
    });
    return txHash;
  }

  /**
   * Adds a pending transaction we should keep an eye on
   * @param purseId {string} - The purse to add the pending transaction to
   * @param txHash {string} - The transaction hash
   * @param txObj {string} - The transaction object
   * @param sender {string} - The sender of transaction
   */
  async addPending(
    purseId: string,
    txHash: string,
    txObj: any,
    sender: string,
  ) {
    const purse = await this.findPurse(purseId);
    const sc = this.supportedChains[purse.networkId];

    sender = sender ? sc.web3.utils.toChecksumAddress(sender) : null;
    const to = txObj.to ? sc.web3.utils.toChecksumAddress(txObj.to) : txObj.to;

    // Store the tx object for debugging and in case we need to re-sign later
    purse.transactionMeta[txHash] = {
      originalSender: sender,
      txObj: {
        ...txObj,
        to,
      },
    };

    await this.pursesRepository.findAndUpdatePurseProperty(purseId, {
      transactionMeta: purse.transactionMeta,
    });
  }

  /**
   * Get a pending transaction meta-object
   * @param purse {Purses} The purse to get the pending transaction meta-object from
   * @param txHash {string} - The transaction hash
   * @returns {object} representation of the transaction
   */
  async getPendingTransactionMeta(purse: Purses, txHash: string): Promise<any> {
    if (purse.transactionMeta[txHash]) {
      return purse.transactionMeta[txHash];
    } else {
      return null;
    }
  }

  /**
   * Check if a sender has a pending transaction
   * @param purse {Purses} The purse to check
   * @param sender {string} address of the sender to check for
   * @returns {boolean} whether or not the account has a pending transaction
   */
  hasPending(purse: Purses, sender: string) {
    const sc = this.supportedChains[purse.networkId];
    sender = sc.web3.utils.toChecksumAddress(sender);
    for (const txHash of Object.keys(purse.transactionMeta)) {
      if (purse.transactionMeta[txHash].originalSender === sender) {
        return true;
      }
    }
    return false;
  }

  /**
   * Increment the known transaction count for an account
   * @param purseId {string} The purse to increment the known transaction count for
   * @param address {string} - The account address to increment
   */
  async incrementTxCount(purseId: string, address: string) {
    const purse = await this.findPurse(purseId);
    this._enforceExists(purse, address);

    purse.accounts[address].txCount += 1;
    purse.accounts[address].locked = null;
    await this.pursesRepository.findAndUpdatePurseProperty(purseId, {
      accounts: purse.accounts,
    });
  }

  /**
   * Make sure the address is one of our relayer-txn or throw
   * @param purse
   * @param address {string} - The account address to enforce
   */
  _enforceExists(purse: Purses, address: string) {
    if (!Object.keys(purse.accounts).includes(address)) {
      throw new Error(`Address ${address} is not one of our accounts`);
    }
  }

  /**
   * Make sure the address is one of our child relayer-txn or throw
   * @param purse {Purses} - The purse to enforce
   * @param address {string} - The account address to enforce
   */
  _enforceChild(purse: Purses, address: string) {
    if (purse.children.indexOf(address) < 0) {
      throw new Error(`PURSE.PURSE_${address.toUpperCase()}_NOT_CHILD`);
    }
  }
}
