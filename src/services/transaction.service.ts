import { Between } from 'typeorm';
import { transactionRepository } from '@/data-source';
import {
    SearchWalletNumberAndDateDto,
    SearchWalletNumberAndDateRangeDto
} from '@dtos/transaction.dto';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException
} from '@exceptions/common.exceptions';
import { Transaction } from '@/entities/transaction.entity';


export class TransactionService {

    private readonly transactionRepo: typeof transactionRepository = transactionRepository;

    public async findOneByTransactionRef(transactionRef: string, userID: string): Promise<Transaction> {

        const transaction = await this.transactionRepo.findOne({
            relations: {
                wallet: true
            },
            where: {
                transactionRef,
                wallet: { walletHolder: { id: userID } }
            }
        });

        if (transaction) {

            return transaction;

        } else {

            throw new BadRequestException(`Invalid Transaction Ref`)
        }

    };

    public async findAllTransactionsOnWalletByUser(
        walletNumber: number,
        userID: string
    ): Promise<Transaction[]> {

        const foundTransactions = await this.transactionRepo.find({
            where: {
                wallet: {
                    walletNumber,
                    walletHolder: { id: userID }
                },
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (foundTransactions.length) {

            return foundTransactions;

        } else {

            throw new ForbiddenException(`User not allowed to query transactions on Wallet with walletNumber: ${walletNumber}`)
        }
    }

    public async findAllTransactionsOnWalletByUserAndDate(
        searchDateDto: SearchWalletNumberAndDateDto,
        userID: string
    ): Promise<Transaction[]> {

        const { walletNumber, searchDate } = searchDateDto;

        const endDate = new Date(searchDate).getTime() + 86400000;

        const foundTransactions = await this.transactionRepo.find({
            where: {
                createdAt: Between(new Date(searchDate), new Date(endDate)),
                wallet: {
                    walletNumber,
                    walletHolder: { id: userID }
                },
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (foundTransactions.length) {

            return foundTransactions

        } else {

            throw new NotFoundException(
                `No Transaction(s) for Wallet ${walletNumber} on ${searchDate.toLocaleString(
                    undefined,
                    {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                }`
            )
        }
    };

    public async findAllTransactionsOnWalletByUserAndDateRange(
        ssearchDateRangeDto: SearchWalletNumberAndDateRangeDto,
        userID: string
    ): Promise<Transaction[]> {

        const { walletNumber, startDate, endDate } = ssearchDateRangeDto;

        const foundTransactions = await this.transactionRepo.find({
            where: {
                createdAt: Between(new Date(startDate), new Date(endDate)),
                wallet: {
                    walletNumber,
                    walletHolder: { id: userID }
                },
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (foundTransactions.length) {

            return foundTransactions

        } else {

            throw new NotFoundException(
                `No Transaction(s) for Wallet ${walletNumber} between the specified dates`
            )
        }
    };

}