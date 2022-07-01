import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { MetaApiService } from '@/modules/meta-api/meta-api.service';
import { MetaApi } from '@/modules/meta-api/entities/meta-api.entity';

@Injectable()
export class MetaApiSubscriber implements EntitySubscriberInterface<MetaApi> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly metaApiService: MetaApiService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return MetaApi;
  }

  async beforeUpdate(event: UpdateEvent<MetaApi>) {
    event.entity.updatedAt = new Date();
  }

  async beforeInsert(event: InsertEvent<MetaApi>) {
    event.entity.createdAt = new Date();
  }
}
