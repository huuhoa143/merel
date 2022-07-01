import { Module } from '@nestjs/common';
import { CronjobService } from './cronjobs.service';
import { CronjobController } from './cronjobs.controller';
import { CronjobRepository } from './cronjobs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SettingsModule } from '@/modules/settings/settings.module';
import { PurseModule } from '@/modules/purse/purse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CronjobRepository]),
    SettingsModule,
    PurseModule,
  ],
  controllers: [CronjobController],
  providers: [ConfigService, CronjobService],
  exports: [CronjobService],
})
export class CronjobModule {}
