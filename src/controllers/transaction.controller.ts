import { Request, Response, NextFunction } from 'express'
import { TransactionService } from '@services/transaction.service';


export class TransactionController {

    private readonly transactionService = new TransactionService()

    public getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const responseData = await this.transactionService.findAll();

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    };
}