import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './delivery/http/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersSubscriber } from '@/modules/users/entities/users.subscriber';
import { AuthModule } from '@/auth/auth.module';
import { UserRepository } from '@/modules/users/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
