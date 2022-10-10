import { Between } from 'typeorm';
import { transactionRepository } from '@/data-source';
import { SearchAccountNumberAndDateDto } from '@dtos/transaction.dto';
import { BadRequestException, ForbiddenException, NotFoundException } from '@exceptions/common.exceptions';
import { SuccessResponse } from '@helpers/successResponse';


export class TransactionService {

    private readonly transactionRepo: typeof transactionRepository = transactionRepository;

    public async findAll(): Promise<SuccessResponse> {

        const allTransactions = await this.transactionRepo.find({
            order: {
                createdAt: 'DESC'
            }
        });

        if (allTransactions.length) {

            return new SuccessResponse(200, 'All Transactions', allTransactions);

        } else {

            throw new NotFoundException('No Transactions on the Server');

        }
    };

    public async findOneById(id: string): Promise<SuccessResponse> {

        const account = await this.transactionRepo.findOne({
            relations: {
                account: true,
            },
            where: { id }
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
                account: true
            },
            where: {
                transactionRef,
                account: { accountHolder: { id: userID } }
            }
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

        const foundTransactions = await this.transactionRepo.find({
            where: {
                account: {
                    accountNumber,
                    accountHolder: { id: userID }
                },
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (foundTransactions.length) {

            return new SuccessResponse(200, 'All Transactions on Account', foundTransactions);

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

        const foundTransactions = await this.transactionRepo.find({
            where: {
                createdAt: Between(new Date(searchDate), new Date(endDate)),
                account: {
                    accountNumber,
                    accountHolder: { id: userID }
                },
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (foundTransactions.length) {

            return new SuccessResponse(
                200,
                `All Account Transactions on ${searchDate.toLocaleString(
                    undefined,
                    {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                }`,
                foundTransactions
            );

        } else {

            throw new NotFoundException(
                `No Transaction(s) for Account ${accountNumber} on ${searchDate.toLocaleString(
                    undefined,
                    {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                }`
            )
        }
    }
}