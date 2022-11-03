import { Request, Response } from 'express';
import { BaseRouter } from '../base.router';
import { AdminRouter } from './admin.route';
import { AuthRouter } from '@routes/api/auth.route';
import { TransactionRouter } from '@routes/api/transaction.route';
import { UserRouter } from '@routes/api/user.route';
import { WalletRouter } from '@/routes/api/wallet.route';


export class ApiRouter extends BaseRouter {

    constructor() {
        super()
        this.registerRoutes()
    }

    protected registerRoutes() {

        this.router.get('/', (req: Request, res: Response) => res.json({
            message: `HELLO VISITOR, THANK YOU FOR VISITING`
        }));

        this.router.use('/admin', new AdminRouter().getRoutes());
        this.router.use('/auth', new AuthRouter().getRoutes());
        this.router.use('/transactions', new TransactionRouter().getRoutes());
        this.router.use('/users', new UserRouter().getRoutes());
        this.router.use('/wallets', new WalletRouter().getRoutes());
    };

}