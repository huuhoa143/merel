import { Module } from '@nestjs/common';
import { PurseService } from '@/modules/purse/purse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PursesRepository } from '@/modules/purse/purse.repository';
import { SettingsModule } from '@/modules/settings/settings.module';

@Module({
  imports: [TypeOrmModule.forFeature([PursesRepository]), SettingsModule],
  providers: [PurseService],
  exports: [PurseService],
})
export class PurseModule {}
