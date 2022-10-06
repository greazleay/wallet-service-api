import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/route.interface';
import { validateRequest } from '@helpers/validateRequest';
import { AccountService } from '@services/account.service';
import { AccountIdDto, AccountNumberDto, DepositOrWithdrawFundsDto, OpenAccountDto } from '@dtos/account.dto';

const accountService: AccountService = new AccountService();

export class AccountController {

    public async openAccount(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const openAccountDto = await validateRequest(OpenAccountDto, req.body);

            const responseData = await accountService.openNewAccount(openAccountDto, req.user);

            res.status(201).json(responseData);

        } catch (error) {
            next(error)
        }
    };

    public async getAllAccounts(req: Request, res: Response, next: NextFunction) {
        try {

            const responseData = await accountService.findAll();

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    };

    public async getOneById(req: Request, res: Response, next: NextFunction) {
        try {

            const { accountId } = await validateRequest(AccountIdDto, req.params);

            const responseData = await accountService.findOneById(accountId);

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    };

    public async getOneByAccountNumber(req: Request, res: Response, next: NextFunction) {
        try {

            const { accountNumber } = await validateRequest(AccountNumberDto, req.body);

            const responseData = await accountService.findOneByAccountNumber(accountNumber)

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    };

    public async getByUser(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const { id } = req.user

            const responseData = await accountService.findByUser(id)

            res.status(200).json(responseData)

        } catch (error) {
            console.log(error)
            next(error)
        }
    };

    public async getAccountBalance(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const { accountNumber } = await validateRequest(AccountNumberDto, req.body);

            const { id } = req.user;

            const responseData = await accountService.checkAccountBalance(accountNumber, id);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    };

    public async depositFunds(req: Request, res: Response, next: NextFunction) {
        try {

            const depositFundsDto = await validateRequest(DepositOrWithdrawFundsDto, req.body);

            const responseData = await accountService.depositFunds(depositFundsDto)

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    }

}