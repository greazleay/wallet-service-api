import { Account } from '@entities/account.entity'

export enum TransactionMode {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT',
}

export enum TransactionType {
    FUNDS_TRANSFER = 'FUNDS TRANSFER',
    FUNDS_DEPOSIT = 'FUNDS DEPOSIT',
    FUNDS_WITHDRAWAL = 'FUNDS WITHDRAWAL'
}

export enum TransactionStatus {
    FAILED = 'FAILED',
    SUCCESSFUL = 'SUCCESSFUL',
}

export interface IGenerateDepositOrWithdrawalTransactionParams {
    account: Account,
    transactionAmount: number,
    transactionParty: string,
    isDebit: boolean
}

export interface IGenerateFundsTransferTransactionParams {
    debitAccount: Account,
    creditAccount: Account,
    transferAmount: number,
    isDebit: boolean
}