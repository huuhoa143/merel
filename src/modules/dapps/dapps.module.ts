import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { DappsRepository } from '@/modules/dapps/dapps.repository';
import { DappsController } from '@/modules/dapps/dapps.controller';
import { DappsService } from '@/modules/dapps/dapps.service';
import { DappsSubscriber } from '@/modules/dapps/entities/dapps.subscriber';
import { UsersModule } from '@/modules/users/users.module';
import { PurseModule } from '@/modules/purse/purse.module';
import { SettingsModule } from '@/modules/settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DappsRepository]),
    forwardRef(() => AuthModule),
    UsersModule,
    PurseModule,
    SettingsModule,
  ],
  controllers: [DappsController],
  providers: [DappsService, DappsSubscriber],
  exports: [DappsService],
})
export class DappsModule {}
