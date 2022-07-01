import { CronjobService } from '../cronjobs.service';
import { Runner } from './runner';
import Web3 from 'web3';
import { SettingsService } from '@/modules/settings/settings.service';
import configuration from '@/config/configuration';
import { Logger } from '@nestjs/common';
import { PurseService } from '@/modules/purse/purse.service';
import { numberToBN } from '@/common/utility/random.utility';
import {
  BASE_FUND_VALUE,
  MASTER_WALLET_THRESHOLD,
  MAX_LOCK_TIME,
  MIN_CHILD_BALANCE,
  ZERO,
} from '@/common/constants/defaults';
import BN from 'bignumber.js';

export class PurseAutoFundRunner extends Runner {
  private readonly logger = new Logger(PurseAutoFundRunner.name);
  private readonly supportedChains: any;
  private interval: number;

  constructor(
    cronjobService: CronjobService,
    private readonly purseService: PurseService,
    private readonly settingsService: SettingsService,
  ) {
    super(cronjobService);

    this.supportedChains = {};
    this.interval = 0;
  }

  getTimeout(): number {
    return configuration().cronjob.defaultTimeout;
  }

  async estimateTxFeeForFunding(
    networkId: string,
    from: string,
    to: string,
    amount: BN,
  ) {
    const sc = this.supportedChains[networkId];
    const gasPrice = await sc.web3.eth.getGasPrice();
    const gasLimit = await sc.web3.eth.estimateGas({
      from,
      to,
      value: amount.toFixed(),
      data: '0x',
    });
    return new BN(gasPrice).multipliedBy(new BN(gasLimit));
  }

  async run() {
    await this._init();
    const purses = await this.purseService.getAllPurserReady();
    if (!purses || purses.length <= 0) return;

    purses
      .filter((p) => p.checkBalances && p.autofundChildren)
      .map(async (purse) => {
        try {
          // Prompt for funding of the master account
          const masterAddress = purse.masterWallet.publicKey;
          const sc = this.supportedChains[purse.networkId];
          const masterBalance = numberToBN(
            await sc.web3.eth.getBalance(masterAddress),
          );

          const baseFundValue = purse.config.baseFundValue
            ? new BN(purse.config.baseFundValue)
            : BASE_FUND_VALUE;

          const minChildBalance = purse.config.minChildBalance
            ? new BN(purse.config.minChildBalance)
            : MIN_CHILD_BALANCE;

          const masterWalletThreshold = purse.config.masterWalletThreshold
            ? new BN(purse.config.masterWalletThreshold)
            : MASTER_WALLET_THRESHOLD;

          const masterBalanceDepleted = masterBalance.lt(masterWalletThreshold);
          const balanceEther = sc.web3.utils.fromWei(
            masterBalance.toString(),
            'ether',
          );
          if (masterBalance.eq(ZERO)) {
            this.logger.error(
              `Master account needs to be funded, Master account ${masterAddress} has zero balance!`,
            );
            return;
          } else if (masterBalanceDepleted) {
            // TODO: Send notification to user
            this.logger.warn(
              `Master account is depleted @ ${balanceEther} Ether. Add funds soon! Please Send funds to ${masterAddress}`,
            );
            return;
          }

          const childrenToFund = [];
          for (const child of purse.children) {
            const childBalance = numberToBN(
              await sc.web3.eth.getBalance(child),
            );
            this.logger.log(
              `Child ${child} has balance ${sc.web3.utils.fromWei(
                childBalance.toString(),
              )}`,
            );
            if (
              childBalance.lt(minChildBalance) &&
              !purse.accounts[child].hasPendingFundingTx
            ) {
              childrenToFund.push({
                address: child,
                childBalance,
              });
            } else if (
              childBalance.lt(minChildBalance) &&
              purse.accounts[child].hasPendingFundingTx
            ) {
              this.logger.warn(`Child ${child} has pending funding tx`);
              await this.purseService.updateHasPendingFundingTx(
                purse,
                child,
                false,
              );
            }
          }

          if (childrenToFund.length > 0) {
            const masterBalanceLow = masterBalance.lt(
              baseFundValue.multipliedBy(new BN(childrenToFund.length)),
            );
            if (masterBalanceLow) {
              this.logger.warn(
                `Master account is low @ ${balanceEther} Ether. Add funds soon! Please Send funds to ${masterAddress}`,
              );
            }
            this.logger.log(
              `Planning to fund ${childrenToFund.length} child accounts`,
            );
            for (const child of childrenToFund) {
              try {
                // Checking master wallet balance greater than base funding value plus gas fee
                const valueToSend = baseFundValue;
                const fundingTxFee = await this.estimateTxFeeForFunding(
                  purse.networkId,
                  purse.masterWallet.publicKey,
                  child.address,
                  valueToSend,
                );
                if (masterBalance.lt(valueToSend.plus(fundingTxFee))) {
                  this.logger.warn(
                    `Master account with (balance: ${masterBalance.toString()} is less than base funding value plus gas fee. Add funds soon! Please Send funds to ${masterAddress}`,
                  );
                  continue;
                }
                this.logger.log(
                  `Refunding for ${child.address} using ${fundingTxFee}`,
                );

                this.logger.log(
                  `Will fund ${
                    child.address
                  } children with ${sc.web3.utils.fromWei(
                    valueToSend.toString(),
                    'ether',
                  )} ether`,
                );

                this.logger.log(`Making funding request for ${child.address}`);
                await this.purseService._fundChild(
                  purse.id.toString(),
                  child.address,
                  valueToSend,
                );
              } catch (err) {
                this.logger.error(
                  `Unable to fund child ${child.address} due to error: ${err.message}`,
                );
              }
            }
          }

          /**
           * Clean up any locks that are inexplicably open.  This really shouldn't happen, but it's
           * worth clearing these in case they do otherwise the whole system could come to a halt.
           */
          if (this.interval % (MAX_LOCK_TIME / 1000) === 0) {
            for (const child of purse.children) {
              const account = purse.accounts[child];
              if (
                account.locked !== null &&
                new Date(Number(account.locked) + MAX_LOCK_TIME) < new Date()
              ) {
                this.logger.error(
                  'Found an open lock on child account. Clearing lock.',
                );
                await this.purseService.unlockChild(purse, child);
              }
            }

            this.logger.warn(
              'Saving purse with open locks. This should not happen.',
            );
          }
          this.interval++;
        } catch (err) {
          this.logger.error(
            `Error processing purse ${purse.id}, ${err.message}`,
          );
        }
      });
  }

  getTaskName(): string {
    return PurseAutoFundRunner.name;
  }

  /**
   * Init variables
   */
  private async _init() {
    const chains = await this.settingsService.findAllSupportedChains();
    if (!chains || chains.length <= 0) {
      console.log('No supported chains found');
      return;
    }
    for (const c of chains) {
      const { networkId, currency, provider } = c;
      // HTTP providers
      const web3 = new Web3(provider);

      // Add new supported chain config for given network
      this.supportedChains[networkId] = {
        currency,
        provider,
        web3: web3,
      };
    }
  }
}
