import { Wallet } from '@/entities/wallet.entity'

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
    wallet: Wallet,
    transactionAmount: number,
    transactionParty: string,
    isDebit: boolean
}

export interface IGenerateFundsTransferTransactionParams {
    debitWallet: Wallet,
    creditWallet: Wallet,
    transferAmount: number,
    isDebit: boolean
}