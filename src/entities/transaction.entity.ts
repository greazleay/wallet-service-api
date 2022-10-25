import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@entities/abstract.entity';
import { Wallet } from '@/entities/wallet.entity';
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

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, { nullable: true })
  wallet: Wallet;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  walletBalance: number;

  @Column('varchar', { length: 255, nullable: true })
  transactionRef: string;

  @BeforeInsert()
  addTransactionRef() {
    this.transactionRef = `${this.transactionMode}: ${this.transactionType}-${(new Date()).getTime()}`;
  }

  public async generateDepositOrWithdrawalTransaction({
    wallet,
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
    this.wallet = wallet;
    this.walletBalance = wallet.walletBalance;
  };

  public async generateFundsTransferTransaction({
    debitWallet,
    creditWallet,
    transferAmount,
    isDebit
  }: IGenerateFundsTransferTransactionParams) {

    const {
      walletBalance: debitWalletBalance,
      walletName: debitWalletName,
      walletNumber: debitWalletNumber
    } = debitWallet;

    const {
      walletBalance: creditWalletBalance,
      walletName: creditWalletName,
      walletNumber: creditWalletNumber
    } = creditWallet;

    const creditDescription = `CREDIT: Funds Transfer of ${transferAmount} from ${debitWalletName} - ${debitWalletNumber}`
    const debitDescription = `DEBIT: Funds Transfer of ${transferAmount} to ${creditWalletName} - ${creditWalletNumber}`

    this.description = isDebit ? debitDescription : creditDescription;
    this.transactionAmount = transferAmount;
    this.transactionMode = isDebit ? TransactionMode.DEBIT : TransactionMode.CREDIT;
    this.transactionType = TransactionType.FUNDS_TRANSFER;
    this.transactionStatus = TransactionStatus.SUCCESSFUL;
    this.wallet = isDebit ? debitWallet : creditWallet;
    this.walletBalance = isDebit ? debitWalletBalance : creditWalletBalance;
  }

}