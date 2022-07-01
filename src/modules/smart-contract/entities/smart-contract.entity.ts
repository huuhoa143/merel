import { classToPlain, Transform } from 'class-transformer';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
import {
  metaTransactionTypeEnums,
  smartContractTypeEnums,
} from '@/modules/smart-contract/enums/smart-contract.enum';

@Entity({
  name: 'smartContracts',
})
export class SmartContract extends BaseEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false })
  type: smartContractTypeEnums = smartContractTypeEnums.SC;

  @Column({ nullable: false, select: false })
  abi: string;

  @Column({ default: null })
  address: string;

  @Column({ default: null })
  dappId: string;

  @Column({ default: null })
  metaTransactionType: metaTransactionTypeEnums =
    metaTransactionTypeEnums.ERC20_FORWARDER;

  @Column()
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date = new Date();

  toJSON() {
    return classToPlain(this);
  }
}
