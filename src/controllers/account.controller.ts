import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/route.interface';
import { validateRequest } from '@helpers/validateRequest';
import { AccountService } from '@services/account.service';
import {
    AccountIdDto,
    AccountNumberDto,
    DepositFundsDto,
    OpenAccountDto,
    TransferFundsDto,
    WithdrawFundsDto
} from '@dtos/account.dto';


export class AccountController {

    private readonly accountService: AccountService = new AccountService();

    public openAccount = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { user } = req;

            const openAccountDto = await validateRequest(OpenAccountDto, req.body);

            const responseData = await this.accountService.openNewAccount(openAccountDto, user);

            res.status(201).json(responseData);

        } catch (error) {
            next(error)
        }
    };

    public getAllAccounts = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const responseData = await this.accountService.findAll();

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    };

    public getOneById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { accountId } = await validateRequest(AccountIdDto, req.params);

            const responseData = await this.accountService.findOneById(accountId);

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    };

    public getOneByAccountNumber = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const { accountNumber } = await validateRequest(AccountNumberDto, req.body);

            const responseData = await this.accountService.findOneByAccountNumber(accountNumber, id)

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    };

    public getByUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const responseData = await this.accountService.findByUser(id)

            res.status(200).json(responseData)

        } catch (error) {
            console.log(error)
            next(error)
        }
    };

    public getAccountBalance = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const { accountNumber } = await validateRequest(AccountNumberDto, req.body);

            const responseData = await this.accountService.checkAccountBalance(accountNumber, id);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    };

    public depositFunds = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const depositFundsDto = await validateRequest(DepositFundsDto, req.body);

            const responseData = await this.accountService.depositFunds(depositFundsDto)

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    };

    public withdrawFunds = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const depositFundsDto = await validateRequest(WithdrawFundsDto, req.body);

            const responseData = await this.accountService.withdrawFunds(depositFundsDto, id);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    }

    public transferFunds = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const transferFundsDto = await validateRequest(TransferFundsDto, req.body);

            const responseData = await this.accountService.transferFunds(transferFundsDto, id);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    }

}