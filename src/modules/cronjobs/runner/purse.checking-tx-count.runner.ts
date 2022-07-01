import { CronjobService } from '../cronjobs.service';
import { Runner } from './runner';
import Web3 from 'web3';
import { SettingsService } from '@/modules/settings/settings.service';
import configuration from '@/config/configuration';
import { Logger } from '@nestjs/common';
import { PurseService } from '@/modules/purse/purse.service';

export class PurseCheckingTxCountRunner extends Runner {
  private readonly logger = new Logger(PurseCheckingTxCountRunner.name);
  private readonly supportedChains: any;

  constructor(
    cronjobService: CronjobService,
    private readonly purseService: PurseService,
    private readonly settingsService: SettingsService,
  ) {
    super(cronjobService);

    this.supportedChains = {};
    // (async () => {
    //   await this._init();
    // })();
  }

  getTimeout(): number {
    return configuration().cronjob.defaultTimeout;
  }

  async run() {
    await this._init();
    const purses = await this.purseService.getAllPurserReady();
    if (!purses || purses.length <= 0) return;

    purses.map(async (purse) => {
      // Checking txCount from database with web3
      Object.keys(purse.accounts).map(async (account) => {
        if (!purse.accounts[account].locked) {
          const txCount = purse.accounts[account].txCount;
          const sc = this.supportedChains[purse.networkId];
          const w3txCount = await sc.web3.eth.getTransactionCount(
            account,
            'pending',
          );
          // Compare txCount from database with txCount from web3
          if (txCount !== w3txCount) {
            // If different, update txCount in database
            this.logger.warn(
              `Update txCount for ${account} from ${txCount} to ${w3txCount}`,
            );
            await this.purseService.updateTxCount(purse, account, w3txCount);
          }
        }
      });
    });
  }

  getTaskName(): string {
    return PurseCheckingTxCountRunner.name;
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
