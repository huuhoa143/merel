import { classToPlain, Transform } from 'class-transformer';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
import { hdkey } from 'ethereumjs-wallet';

export class PurseConfig {
  @Column()
  baseFundValue: string;

  @Column()
  minChildBalance: string;

  @Column()
  masterWalletThreshold: string;
}

@Entity({
  name: 'purses',
})
export class Purses extends BaseEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column({ nullable: true })
  networkId: string;

  @Column({ nullable: false })
  mnemonic: string;

  @Column({ nullable: false, select: false })
  childrenToCreate: number;

  @Column({ nullable: false, select: false })
  autofundChildren: boolean;

  @Column({ nullable: false, select: false })
  maxPendingPerAccount: number;

  @Column({ nullable: false, select: false })
  ready: boolean;

  @Column({ nullable: false, select: false })
  isProcessRunning: boolean;

  @Column({ nullable: false, select: false })
  accountLookupInProgress: boolean;

  @Column({ nullable: false, select: false })
  masterKey: hdkey;

  @Column({ nullable: false, select: false })
  masterWallet: {
    publicKey: string;
    privateKey: string;
  };

  @Column({ nullable: false, select: false })
  checkBalances: boolean;

  @Column({ nullable: false, select: false })
  children: string[];

  @Column({ nullable: false, select: false })
  accounts: { [key: string]: any } = {};

  @Column({ nullable: false, select: false })
  transactionMeta: { [key: string]: any } = {};

  @Column({ nullable: false, select: false })
  pendingTransactions: { [key: string]: any } = {};

  @Column({ nullable: false, select: false })
  config: PurseConfig;

  @Column()
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date = new Date();

  toJSON() {
    return classToPlain(this);
  }
}
