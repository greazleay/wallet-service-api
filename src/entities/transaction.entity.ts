import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@entities/abstract.entity';
import { Account } from '@entities/account.entity';
import { TransactionMode, TransactionType, TransactionStatus } from '@interfaces/transaction.interface';

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

  @ManyToOne(() => Account, (account) => account.debitTransactions, { nullable: true })
  debitAccount: Account;

  @ManyToOne(() => Account, (account) => account.creditTransactions, { nullable: true })
  creditAccount: Account;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  accountBalance: number;

  @Column('varchar', { length: 255, nullable: true })
  transactionRef: string;

  @BeforeInsert()
  addTransactionRef() {
    this.transactionRef = `${this.transactionType}-${this.transactionMode}-${this.createdAt.getTime()}`;
  }

  public async generateDepositTransaction(account: Account, transactionAmount: number, transactionParty: string) {

    this.description = `Deposit of ${transactionAmount} made by ${transactionParty}`;
    this.transactionAmount = transactionAmount;
    this.transactionMode = TransactionMode.CREDIT;
    this.transactionType = TransactionType.FUNDS_DEPOSIT;
    this.transactionStatus = TransactionStatus.SUCCESSFUL;
    this.creditAccount = account;
    this.accountBalance = account.accountBalance;
  }

  public async generateWithdrawalTransaction(account: Account, transactionAmount: number, transactionParty: string) {

    this.description = `Cash Withdrawal of ${transactionAmount} made by ${transactionParty}`
    this.transactionAmount = transactionAmount;
    this.transactionMode = TransactionMode.DEBIT;
    this.transactionType = TransactionType.FUNDS_WITHDRAWAL;
    this.transactionStatus = TransactionStatus.SUCCESSFUL;
    this.debitAccount = account;
    this.accountBalance = account.accountBalance;
  }

  public async generateFundsTransferTransaction(
    debitAccount: Account,
    creditAccount: Account,
    transactionAmount: number,
    isDebit: boolean
  ) {

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
    ;
    this.description = `Funds transfer of ${transactionAmount} from ${debitAccountNumber} - ${debitAccountName} to ${creditAccountNumber} - ${creditAccountName}`;
    this.transactionAmount = transactionAmount;
    this.transactionMode = isDebit ? TransactionMode.DEBIT : TransactionMode.CREDIT;
    this.transactionType = TransactionType.FUNDS_TRANSFER;
    this.transactionStatus = TransactionStatus.SUCCESSFUL;
    this.debitAccount = debitAccount;
    this.creditAccount = creditAccount;
    this.accountBalance = isDebit ? debitAccountBalance : creditAccountBalance;
  }

}