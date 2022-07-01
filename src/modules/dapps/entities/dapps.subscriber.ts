import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Dapp } from './dapps.entity';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DappsService } from '@/modules/dapps/dapps.service';

@Injectable()
export class DappsSubscriber implements EntitySubscriberInterface<Dapp> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly merchantsService: DappsService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Dapp;
  }

  async beforeUpdate(event: UpdateEvent<Dapp>) {
    event.entity.updatedAt = new Date();
  }

  async beforeInsert(event: InsertEvent<Dapp>) {
    event.entity.createdAt = new Date();
  }
}
