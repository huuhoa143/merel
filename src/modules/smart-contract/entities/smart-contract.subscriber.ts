import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { SmartContract } from '@/modules/smart-contract/entities/smart-contract.entity';
import { SmartContractService } from '@/modules/smart-contract/smart-contract.service';

@Injectable()
export class SmartContractSubscriber
  implements EntitySubscriberInterface<SmartContract>
{
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly smartContractService: SmartContractService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return SmartContract;
  }

  async beforeUpdate(event: UpdateEvent<SmartContract>) {
    event.entity.updatedAt = new Date();
  }

  async beforeInsert(event: InsertEvent<SmartContract>) {
    event.entity.createdAt = new Date();
  }
}
