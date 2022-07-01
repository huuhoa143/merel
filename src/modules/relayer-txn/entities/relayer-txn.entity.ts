import { classToPlain, Transform } from 'class-transformer';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
import { RelayerTxnEnums } from '@/modules/relayer-txn/relayer-txn.enums';

@Entity({
  name: 'relayerTxns',
})
export class RelayerTxns extends BaseEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column({ nullable: false, select: false })
  status: RelayerTxnEnums = RelayerTxnEnums.PENDING;

  @Column({ nullable: false, select: false })
  from: string;

  @Column({ nullable: false, select: false })
  to: string;

  @Column({ nullable: false, select: false })
  method: string;

  @Column({ nullable: false, select: false })
  smartContractId: string;

  @Column({ nullable: false, select: false })
  txHash: string;

  @Column({ nullable: false, select: false })
  gasPrice: string;

  @Column({ nullable: false, select: false })
  gasLimit: string;

  @Column({ nullable: false, select: false })
  dappId: string;

  @Column()
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date = new Date();

  toJSON() {
    return classToPlain(this);
  }
}
