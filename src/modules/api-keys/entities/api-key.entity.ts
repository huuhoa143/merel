import { Transform } from 'class-transformer';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity({
  name: 'apiKeys',
})
export class ApiKey extends BaseEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column({ nullable: false })
  userId: ObjectID;

  @Column({ nullable: false })
  apiKey: string;

  @Column()
  note: string;

  @Column()
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date = new Date();
}
