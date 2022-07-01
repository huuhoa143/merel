/* eslint-disable prefer-const */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SettingsRepository } from '@/modules/settings/settings.repository';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly settingsRepository: SettingsRepository) {}

  async findById(id: string) {
    return this.settingsRepository.findOne(id);
  }

  async getNetworkProvider(networkId: string) {
    const settings = await this.settingsRepository.findOne({});
    const provider = settings.chains.find(
      (c) => c.networkId.toString() === networkId,
    ).provider;
    if (!provider) {
      throw new NotFoundException('SETTINGS.PROVIDER_NOT_FOUND');
    }
    return provider;
  }

  async getNativeTokenCMCId(networkId: string) {
    const settings = await this.settingsRepository.findOne({});
    const cmcId = settings.chains.find(
      (c) => c.networkId.toString() === networkId,
    ).cmcId;
    if (!cmcId) {
      throw new NotFoundException('SETTINGS.CMC_ID_NOT_FOUND');
    }
    return cmcId;
  }

  async findAllSupportedChains() {
    return this.settingsRepository.findAllSupportedChains();
  }
}
