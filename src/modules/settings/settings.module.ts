import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from '@/modules/settings/settings.service';
import { SettingsRepository } from '@/modules/settings/settings.repository';
import { settings } from '@/modules/settings/seed/data';
import { Settings } from '@/modules/settings/entities/settings.entity';
import { getRepository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsRepository])],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule implements OnModuleInit {
  async onModuleInit() {
    console.log('On init crypto setting...');
    const settingRepository = getRepository(Settings);
    const isExistSettings = await settingRepository.findOne({});
    if (!isExistSettings) {
      await settingRepository.save(settings);
    }
  }
}
