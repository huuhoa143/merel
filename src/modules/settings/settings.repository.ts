import { EntityRepository, getMongoRepository, Repository } from 'typeorm';
import { Settings } from '@/modules/settings/entities/settings.entity';

@EntityRepository(Settings)
export class SettingsRepository extends Repository<Settings> {
  saveSettings(settings: Settings): Promise<Settings> {
    return getMongoRepository(Settings).save(settings);
  }

  async findAllSupportedChains() {
    const settings = await getMongoRepository(Settings).findOne({
      select: ['chains'],
    });
    return settings?.chains;
  }
}
