import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { SmartContractController } from '@/modules/smart-contract/smart-contract.controller';
import { SmartContractService } from '@/modules/smart-contract/smart-contract.service';
import { SmartContractSubscriber } from '@/modules/smart-contract/entities/smart-contract.subscriber';
import { SmartContractRepository } from '@/modules/smart-contract/smart-contract.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmartContractRepository]),
    forwardRef(() => AuthModule),
    UsersModule,
  ],
  controllers: [SmartContractController],
  providers: [SmartContractService, SmartContractSubscriber],
  exports: [SmartContractService],
})
export class SmartContractModule {}
