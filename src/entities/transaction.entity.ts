import { Column, Entity, ManyToOne, BeforeInsert } from 'typeorm';
import { AbstractEntity } from '@entities/abstract.entity';
import { Account } from '@src/entities/account.entity';
import { TransactionMode, TransactionType, TransactionStatus } from '@interfaces/transaction.interface';

@Entity()
export class Transaction extends AbstractEntity {

  @Column('datetime')
  transactionDate!: Date;

  @Column('varchar', { length: 255, default: '' })
  description!: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  transactionAmount!: number;

  @Column('enum', { enum: TransactionType, default: TransactionType.FUNDS_DEPOSIT })
  transactionType!: TransactionType;

  @Column('enum', { enum: TransactionMode, default: TransactionMode.DEBIT })
  transactionMode!: TransactionMode;

  @Column('enum', { enum: TransactionStatus, default: TransactionStatus.SUCCESSFUL })
  transactionStatus!: TransactionStatus;

  @ManyToOne(() => Account, (account) => account.transactions, { nullable: true })
  fromAccount!: Account;

  @ManyToOne(() => Account, (account) => account.transactions, { nullable: true })
  toAccount!: Account;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  accountBalance!: number;

  @Column('varchar', { length: 255, nullable: true })
  transactionRef!: string;

  @BeforeInsert()
  addTransactionRef() {
    this.transactionRef = `${this.transactionType}-${this.transactionMode}-${this.transactionDate.getTime()}`;
  }

}