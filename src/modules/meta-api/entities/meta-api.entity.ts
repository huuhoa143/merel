import { classToPlain, Transform } from 'class-transformer';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
import {
  apiTypeEnums,
  methodTypeEnums,
} from '@/modules/meta-api/enums/meta-api.enum';

@Entity({
  name: 'metaApi',
})
export class MetaApi extends BaseEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false })
  apiType: apiTypeEnums = apiTypeEnums.native;

  @Column({ default: null })
  smartContractId: string;

  @Column({ default: null })
  dappId: string;

  @Column({ default: null })
  methodType: methodTypeEnums = methodTypeEnums.read;

  @Column({ default: null })
  method: string;

  @Column()
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date = new Date();

  toJSON() {
    return classToPlain(this);
  }
}
