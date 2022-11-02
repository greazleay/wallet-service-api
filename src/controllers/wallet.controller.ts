import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/route.interface';
import { validateRequest } from '@helpers/validateRequest';
import { WalletService } from '@services/wallet.service';
import {
    WalletNumberDto,
    DepositFundsDto,
    CreateWalletDto,
    TransferFundsDto,
    WithdrawFundsDto
} from '@/dtos/wallet.dto';
import { SuccessResponse } from '@helpers/successResponse';
import { LoggerException } from '@exceptions/common.exceptions';
import { logger } from '@helpers/logger';
import { Controller } from '@decorators/generic.decorator';


@Controller()
export class WalletController {

    private readonly walletService: WalletService;

    constructor() {
        this.walletService = new WalletService();
    }

    public createWallet = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { user } = req;

            const createWalletDto = await validateRequest(CreateWalletDto, req.body);

            const responseData = await this.walletService.createNewWallet(createWalletDto, user);

            res.status(201).json(new SuccessResponse(201, 'Wallet Created', responseData));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getOneByWalletNumber = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const { walletNumber } = await validateRequest(WalletNumberDto, req.body);

            const responseData = await this.walletService.findOneByWalletNumber(walletNumber, id)

            res.status(200).json(new SuccessResponse(200, 'Wallet Retrieved By ID', responseData))

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getByUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const responseData = await this.walletService.findByUser(id)

            res.status(200).json(new SuccessResponse(200, 'All Wallets for User', responseData))

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getWalletBalance = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const { walletNumber } = await validateRequest(WalletNumberDto, req.body);

            const responseData = await this.walletService.checkWalletBalance(walletNumber, id);

            res.status(200).json(new SuccessResponse(200, `Balance on wallet ${walletNumber}`, responseData));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public depositFunds = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const depositFundsDto = await validateRequest(DepositFundsDto, req.body);

            const responseData = await this.walletService.depositFunds(depositFundsDto)

            res.status(200).json(new SuccessResponse(200, 'Deposit Successful', responseData));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public withdrawFunds = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const depositFundsDto = await validateRequest(WithdrawFundsDto, req.body);

            const responseData = await this.walletService.withdrawFunds(depositFundsDto, id);

            res.status(200).json(new SuccessResponse(200, 'Withdrawal Successful', responseData));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public transferFunds = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const transferFundsDto = await validateRequest(TransferFundsDto, req.body);

            const responseData = await this.walletService.transferFunds(transferFundsDto, id);

            res.status(200).json(new SuccessResponse(200, 'Funds Transfer Successful', responseData));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

}