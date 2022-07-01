import { classToPlain, Transform } from 'class-transformer';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity({
  name: 'settings',
})
export class Settings extends BaseEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column({ nullable: true })
  chains: {
    bip44Path: string;
    network: string;
    networkId: string;
    provider: string;
    transactionUrl: string;
    currency: string;
    cmcId: string;
  }[];

  toJSON() {
    return classToPlain(this);
  }
}
