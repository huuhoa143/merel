import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { MetaApiRepository } from '@/modules/meta-api/meta-api.repository';
import { MetaApiController } from '@/modules/meta-api/meta-api.controller';
import { MetaApiService } from '@/modules/meta-api/meta-api.service';
import { MetaApiSubscriber } from '@/modules/meta-api/entities/meta-api.subscriber';
import { SmartContractModule } from '@/modules/smart-contract/smart-contract.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MetaApiRepository]),
    forwardRef(() => AuthModule),
    UsersModule,
    SmartContractModule,
  ],
  controllers: [MetaApiController],
  providers: [MetaApiService, MetaApiSubscriber],
  exports: [MetaApiService],
})
export class MetaApiModule {}
