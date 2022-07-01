import { classToPlain, Transform } from 'class-transformer';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity({
  name: 'dapps',
})
export class Dapp extends BaseEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false })
  status = true;

  @Column({ nullable: false, select: false })
  apiKey: string;

  @Column({ nullable: false, select: false })
  purse: string;

  @Column({ default: null })
  networkId: string;

  @Column({ default: null })
  userId: string;

  @Column()
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date = new Date();

  toJSON() {
    return classToPlain(this);
  }
}
