import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SessionsRepository } from '@/modules/sessions/sessions.repository';
import { SessionService } from '@/modules/sessions/sessions.service';
import { SessionSubscriber } from '@/modules/sessions/entities/session.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([SessionsRepository])],
  providers: [ConfigService, SessionService, SessionSubscriber],
  exports: [SessionService],
})
export class SessionModule {}
