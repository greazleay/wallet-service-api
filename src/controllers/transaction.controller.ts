import { Request, Response, NextFunction } from 'express'
import { TransactionService } from '@services/transaction.service';
import { validateRequest } from '@helpers/validateRequest';
import { SearchAccountNumberAndDateDto, TransactionIdDto, TransactionRefDto } from '@dtos/transaction.dto';
import { AccountNumberDto } from '@/dtos/account.dto';
import { RequestWithUser } from '@/interfaces/route.interface';


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

    public getOneById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { transactionId } = await validateRequest(TransactionIdDto, req.params);

            const responseData = await this.transactionService.findOneById(transactionId);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    };

    public getOneByTransactionRef = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const { transactionRef } = await validateRequest(TransactionRefDto, req.body);

            const responseData = await this.transactionService.findOneByTransactionRef(transactionRef, id);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    };

    public getAllOnAccountByUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const { accountNumber } = await validateRequest(AccountNumberDto, req.body);

            const responseData = await this.transactionService.findAllTransactionsOnAccountByUser(accountNumber, id);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    };

    public getAllOnAccountByUserAndDate = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const searchDateDto = await validateRequest(SearchAccountNumberAndDateDto, req.body);

            const responseData = await this.transactionService.findAllTransactionsOnAccountByUserAndDate(searchDateDto, id);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    };
}