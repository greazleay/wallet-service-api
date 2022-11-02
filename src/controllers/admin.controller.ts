import { NextFunction, Request, Response } from 'express';
import { AdminService } from '@services/admin.service';
import { validateRequest } from '@helpers/validateRequest';
import { SuccessResponse } from '@/helpers/successResponse';
import { EntityIdDto } from '@dtos/common.dto';
import { pageOptions, paginate } from '@helpers/paginate';
import { logger } from '@helpers/logger';
import { LoggerException } from '@exceptions/common.exceptions';
import { Controller } from '@decorators/generic.decorator';


@Controller()
export class AdminController {

    private readonly adminService: AdminService;
    
    constructor() {
        this.adminService = new AdminService()
    }

    public getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { perPage, skip } = pageOptions(req)

            const { fromCache, allTransactions } = await this.adminService.findAllTransactions(perPage, skip);

            res.status(200).json(new SuccessResponse(
                200,
                'All Transactions',
                {
                    fromCache,
                    transactions: paginate(pageOptions(req), allTransactions)
                }
            ));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { id } = await validateRequest(EntityIdDto, req.params);

            const responseData = await this.adminService.findTransactionById(id);

            res.status(200).json(new SuccessResponse(200, `Transaction with ID: ${id} Retrieved`, responseData));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { perPage, skip } = pageOptions(req);

            const { fromCache, allUsers } = await this.adminService.findAllUsers(perPage, skip);

            res.status(200).json(new SuccessResponse(
                200,
                'All Users',
                {
                    fromCache,
                    users: paginate(pageOptions(req), allUsers)
                }
            ));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { id } = await validateRequest(EntityIdDto, req.params);

            const responseData = await this.adminService.findUserById(id);

            res.status(200).json(new SuccessResponse(200, `User with ID: ${id} Retrieved`, responseData));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getAllWallets = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { perPage, skip } = pageOptions(req);

            const { fromCache, allWallets } = await this.adminService.findAllWallets(perPage, skip);

            res.status(200).json(new SuccessResponse(
                200,
                'All Wallets',
                {
                    fromCache,
                    wallets: paginate(pageOptions(req), allWallets)
                }
            ));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public getWalletById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { id } = await validateRequest(EntityIdDto, req.params);

            const responseData = await this.adminService.findWalletById(id);

            res.status(200).json(new SuccessResponse(200, `Wallet with ID: ${id} Retrieved`, responseData));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };
}