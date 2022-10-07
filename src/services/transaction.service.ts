import { Between, Equal } from 'typeorm';
import { transactionRepository } from '@/data-source';
import { SearchAccountNumberAndDateDto } from '@dtos/transaction.dto';
import { BadRequestException, ForbiddenException, NotFoundException } from '@exceptions/common.exceptions';
import { SuccessResponse } from '@helpers/successResponse';


export class TransactionService {

    private readonly transactionRepo: typeof transactionRepository = transactionRepository;

    public async findAll(): Promise<SuccessResponse> {

        const allTransactions = await this.transactionRepo.find({});

        if (allTransactions.length) {

            return new SuccessResponse(200, 'All Transactions', allTransactions);

        } else {

            throw new NotFoundException('No Accounts on the Server');

        }
    };

    public async findOneById(id: string): Promise<SuccessResponse> {

        const account = await this.transactionRepo.findOne({
            where: { id },
            relations: {
                creditAccount: true,
                debitAccount: true
            }
        });

        if (account) {

            return new SuccessResponse(200, 'Transaction Details', account);

        } else {

            throw new NotFoundException(`Transaction with ID: ${id} not found on this server`)
        }

    }

    public async findOneByTransactionRef(transactionRef: string, userID: string): Promise<SuccessResponse> {

        const account = await this.transactionRepo.findOne({
            relations: {
                creditAccount: true,
                debitAccount: true
            },
            where: [
                { transactionRef, creditAccount: { accountHolder: { id: userID } } },
                { transactionRef, debitAccount: { accountHolder: { id: userID } } }
            ]
        });

        if (account) {

            return new SuccessResponse(200, 'Transaction Details', account);

        } else {

            throw new BadRequestException(`Invalid Transaction Ref`)
        }

    };

    public async findAllTransactionsOnAccountByUser(
        accountNumber: number,
        userID: string
    ): Promise<SuccessResponse> {

        const foundAccounts = await this.transactionRepo.find({
            where: [
                {
                    creditAccount: {
                        accountNumber,
                        accountHolder: { id: userID }
                    }
                },
                {
                    debitAccount: {
                        accountNumber,
                        accountHolder: { id: userID }
                    }
                }
            ],
        });

        if (foundAccounts.length) {

            return new SuccessResponse(200, 'All Transactions on Account', foundAccounts);

        } else {

            throw new ForbiddenException(`User not allowed to query transactions on Account with accountNumber: ${accountNumber}`)
        }
    }

    public async findAllTransactionsOnAccountByUserAndDate(
        searchDateDto: SearchAccountNumberAndDateDto,
        userID: string
    ): Promise<SuccessResponse> {

        const { accountNumber, searchDate } = searchDateDto;

        const endDate = new Date(searchDate).getTime() + 86400000;

        const foundAccounts = await this.transactionRepo.find({
            where: [
                {
                    creditAccount: {
                        accountNumber,
                        accountHolder: { id: userID }
                    },
                    createdAt: Between(new Date(searchDate), new Date(endDate))
                },
                {
                    debitAccount: {
                        accountNumber,
                        accountHolder: { id: userID }
                    },
                    createdAt: Between(new Date(searchDate), new Date(endDate))
                }
            ],
        });

        if (foundAccounts.length) {

            return new SuccessResponse(200, 'All Transactions on Account', foundAccounts);

        } else {

            throw new NotFoundException(`No Transaction(s) for Account with accountNumber: ${accountNumber} on ${searchDate}`)
        }
    }
}