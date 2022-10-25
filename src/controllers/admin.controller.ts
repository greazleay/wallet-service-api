import { NextFunction, Request, Response } from 'express';
import { AdminService } from '@services/admin.service';
import { validateRequest } from '@helpers/validateRequest';
import { SuccessResponse } from '@/helpers/successResponse';
import { EntityIdDto } from '@dtos/common.dto';


export class AdminController {

    private readonly adminService = new AdminService()
    
    public getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const responseData = await this.adminService.findAllTransactions();

            res.status(200).json(new SuccessResponse(200, 'All Transactions', responseData))

        } catch (error) {
            next(error)
        }
    };

    public getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { id } = await validateRequest(EntityIdDto, req.params);

            const responseData = await this.adminService.findTransactionById(id);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    };

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const responseData = await this.adminService.findAllUsers();

            res.status(200).json(new SuccessResponse(200, 'All Users', responseData));

        } catch (error) {
            next(error)
        }
    };

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { id } = await validateRequest(EntityIdDto, req.params);

            const responseData = await this.adminService.findUserById(id);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    };

    public getAllWallets = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const responseData = await this.adminService.findAllWallets();

            res.status(200).json(new SuccessResponse(200, 'All Wallets', responseData));

        } catch (error) {
            next(error)
        }
    };

    public getWalletById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { id } = await validateRequest(EntityIdDto, req.params);

            const responseData = await this.adminService.findWalletById(id);

            res.status(200).json(responseData);

        } catch (error) {
            next(error)
        }
    };
}