import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { SessionService } from '@/modules/sessions/sessions.service';
import { SessionEntity } from '@/modules/sessions/entities/session.entity';

@Injectable()
export class SessionSubscriber
  implements EntitySubscriberInterface<SessionEntity>
{
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly sessionService: SessionService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return SessionEntity;
  }

  async beforeUpdate(event: UpdateEvent<SessionEntity>) {
    event.entity.updatedAt = new Date();
  }

  async beforeInsert(event: InsertEvent<SessionEntity>) {
    event.entity.createdAt = new Date();
  }
}
