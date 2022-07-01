import { UsersModule } from '@/modules/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { ApiKeyService } from './api-keys.service';
import { ApiKeyController } from './api-keys.controller';
import { AuthModule } from '@/auth/auth.module';
import { ApiKeyRepository } from './api-keys.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiKeyRepository]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
