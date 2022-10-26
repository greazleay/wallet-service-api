import { Router } from 'express';
import { CustomIRouter } from '@interfaces/route.interface';
import { AdminController } from '@controllers/admin.controller';
import passport from 'passport';
import { Authorize } from '@/middlewares/authorize';


export class AdminRouter {

    private readonly router: CustomIRouter;
    private readonly adminController: AdminController;

    constructor() {
        this.router = Router();
        this.adminController = new AdminController();
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.use(
            passport.authenticate('jwt', { session: false }),
            Authorize.admin
        );

        this.router.get(
            '/transactions',
            this.adminController.getAllTransactions
        );

        this.router.get(
            '/transactions/:id',
            this.adminController.getTransactionById
        );

        this.router.get(
            '/users',
            this.adminController.getAllUsers
        );

        this.router.get(
            '/users/:id',
            this.adminController.getUserById
        );

        this.router.get(
            '/wallets',
            this.adminController.getAllWallets
        );

        this.router.get(
            '/wallets/:id',
            this.adminController.getWalletById
        );

    };

    public getRoutes() {
        return this.router;
    }
}