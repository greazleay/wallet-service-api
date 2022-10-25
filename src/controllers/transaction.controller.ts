import { Response, NextFunction } from 'express'
import { TransactionService } from '@services/transaction.service';
import { validateRequest } from '@helpers/validateRequest';
import { 
    SearchWalletNumberAndDateDto, 
    SearchWalletNumberAndDateRangeDto, 
    TransactionRefDto 
} from '@dtos/transaction.dto';
import { WalletNumberDto } from '@dtos/wallet.dto';
import { RequestWithUser } from '@interfaces/route.interface';
import { SuccessResponse } from '@helpers/successResponse';


export class TransactionController {

    private readonly transactionService = new TransactionService();

    public getOneByTransactionRef = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const { transactionRef } = await validateRequest(TransactionRefDto, req.body);

            const responseData = await this.transactionService.findOneByTransactionRef(transactionRef, id);

            res.status(200).json(new SuccessResponse(200, 'Transaction Details', responseData));

        } catch (error) {
            next(error)
        }
    };

    public getAllOnWalletByUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const { walletNumber } = await validateRequest(WalletNumberDto, req.body);

            const responseData = await this.transactionService.findAllTransactionsOnWalletByUser(walletNumber, id);

            res.status(200).json(new SuccessResponse(200, 'All Transactions on Wallet', responseData));

        } catch (error) {
            next(error)
        }
    };

    public getAllOnWalletByUserAndDate = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const searchDateDto = await validateRequest(SearchWalletNumberAndDateDto, req.body);

            const responseData = await this.transactionService.findAllTransactionsOnWalletByUserAndDate(searchDateDto, id);

            res.status(200).json(new SuccessResponse(
                200,
                `All Wallet Transactions on ${searchDateDto.searchDate.toLocaleString(
                    undefined,
                    {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                }`,
                responseData
            ));

        } catch (error) {
            next(error)
        }
    };

    public getAllOnWalletByUserAndDateRange = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const searchDateRangeDto = await validateRequest(SearchWalletNumberAndDateRangeDto, req.body);

            const responseData = await this.transactionService.findAllTransactionsOnWalletByUserAndDate(searchDateRangeDto, id);

            res.status(200).json(new SuccessResponse(200, 'All Transactions between the search date range', responseData));

        } catch (error) {
            next(error)
        }
    };

}