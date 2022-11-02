import passport from 'passport';
import { BaseRouter } from '../base.router';
import { AdminController } from '@controllers/admin.controller';
import { Authorize } from '@/middlewares/authorize';


export class AdminRouter extends BaseRouter {

    private readonly adminController: AdminController;

    constructor() {
        super()
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

}