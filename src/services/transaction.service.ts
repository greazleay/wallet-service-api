import { transactionRepository } from '@/data-source';
import { NotFoundException } from '@/exceptions/common.exceptions';
import { SuccessResponse } from '@/helpers/successResponse';


export class TransactionService {

    private readonly transactionRepo: typeof transactionRepository = transactionRepository;

    public async findAll(): Promise<SuccessResponse> {

        const allTransactions = await this.transactionRepo.find({
            relations: {
                creditAccount: true
            }
        });

        if (allTransactions.length) {

            return new SuccessResponse(200, 'All Transactions', allTransactions);

        } else {

            throw new NotFoundException('No Accounts on the Server');

        }
    };
}