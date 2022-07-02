import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration, { isProdEnv, isSandboxEnv } from '@/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLoggerMiddleware } from './common/middlewares/logger.middleware';
import { DappsModule } from '@/modules/dapps/dapps.module';
import { SmartContractModule } from '@/modules/smart-contract/smart-contract.module';
import { MetaApiModule } from '@/modules/meta-api/meta-api.module';
import { PublicModule } from '@/modules/public/public.module';
import { SettingsModule } from '@/modules/settings/settings.module';
import { CronjobModule } from '@/modules/cronjobs/cronjobs.module';
import { RelayerTxnModule } from '@/modules/relayer-txn/relayer-txn.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    AuthModule,
    UsersModule,
    DappsModule,
    SmartContractModule,
    MetaApiModule,
    PublicModule,
    SettingsModule,
    CronjobModule,
    RelayerTxnModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Enable logger for all request on production
    if (isProdEnv() || isSandboxEnv()) {
      consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
  }
}
