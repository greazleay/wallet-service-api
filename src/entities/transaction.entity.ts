import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@entities/abstract.entity';
import { Account } from '@entities/account.entity';
import {
  TransactionMode,
  TransactionType,
  TransactionStatus,
  IGenerateDepositOrWithdrawalTransactionParams,
  IGenerateFundsTransferTransactionParams
} from '@interfaces/transaction.interface';

@Entity()
export class Transaction extends AbstractEntity {

  @Column('varchar', { length: 255, default: '' })
  description: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  transactionAmount: number;

  @Column('enum', { enum: TransactionType, default: TransactionType.FUNDS_DEPOSIT })
  transactionType: TransactionType;

  @Column('enum', { enum: TransactionMode, default: TransactionMode.DEBIT })
  transactionMode: TransactionMode;

  @Column('enum', { enum: TransactionStatus, default: TransactionStatus.SUCCESSFUL })
  transactionStatus: TransactionStatus;

  @ManyToOne(() => Account, (account) => account.transactions, { nullable: true })
  account: Account;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  accountBalance: number;

  @Column('varchar', { length: 255, nullable: true })
  transactionRef: string;

  @BeforeInsert()
  addTransactionRef() {
    this.transactionRef = `${this.transactionMode}: ${this.transactionType}-${(new Date()).getTime()}`;
  }

  public async generateDepositOrWithdrawalTransaction({
    account,
    transactionAmount,
    transactionParty,
    isDebit
  }: IGenerateDepositOrWithdrawalTransactionParams) {

    const creditDescription = `CREDIT: Deposit of ${transactionAmount} made by ${transactionParty}`;
    const debitDescription = `DEBIT: Cash Withdrawal of ${transactionAmount} made by ${transactionParty}`

    this.description = isDebit ? debitDescription : creditDescription;
    this.transactionAmount = transactionAmount;
    this.transactionMode = isDebit ? TransactionMode.DEBIT : TransactionMode.CREDIT;
    this.transactionType = isDebit ? TransactionType.FUNDS_WITHDRAWAL : TransactionType.FUNDS_DEPOSIT;
    this.transactionStatus = TransactionStatus.SUCCESSFUL;
    this.account = account;
    this.accountBalance = account.accountBalance;
  };

  public async generateFundsTransferTransaction({
    debitAccount,
    creditAccount,
    transferAmount,
    isDebit
  }: IGenerateFundsTransferTransactionParams) {

    const {
      accountBalance: debitAccountBalance,
      accountName: debitAccountName,
      accountNumber: debitAccountNumber
    } = debitAccount;

    const {
      accountBalance: creditAccountBalance,
      accountName: creditAccountName,
      accountNumber: creditAccountNumber
    } = creditAccount;

    const creditDescription = `CREDIT: Funds Transfer of ${transferAmount} from ${debitAccountName} - ${debitAccountNumber}`
    const debitDescription = `DEBIT: Funds Transfer of ${transferAmount} to ${creditAccountName} - ${creditAccountNumber}`

    this.description = isDebit ? debitDescription : creditDescription;
    this.transactionAmount = transferAmount;
    this.transactionMode = isDebit ? TransactionMode.DEBIT : TransactionMode.CREDIT;
    this.transactionType = TransactionType.FUNDS_TRANSFER;
    this.transactionStatus = TransactionStatus.SUCCESSFUL;
    this.account = isDebit ? debitAccount : creditAccount;
    this.accountBalance = isDebit ? debitAccountBalance : creditAccountBalance;
  }

}