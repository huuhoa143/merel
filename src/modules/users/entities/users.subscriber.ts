import { UsersService } from '@/modules/users/users.service';
import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from './users.entity';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { uniqueCode } from '@/common/utility/common.utility';

@Injectable()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly merchantsService: UsersService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    event.entity.updatedAt = new Date();
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.authToken = uniqueCode();
    event.entity.createdAt = new Date();
  }
}
