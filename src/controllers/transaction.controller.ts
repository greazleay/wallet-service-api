import { Request, Response, NextFunction } from 'express'
import { TransactionService } from '@services/transaction.service';

const transactionService = new TransactionService()

export class TransactionController {

    public async getAllTransactions(req: Request, res: Response, next: NextFunction) {
        try {

            const responseData = await transactionService.findAll();

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    };
}