import { Request, Response, Router } from 'express';
import { AccountRouter } from '@routes/api/account.route';
import { AuthRouter } from '@routes/api/auth.route';
import { TransactionRouter } from '@routes/api/transaction.route';
import { UserRouter } from '@routes/api/user.route';


export class ApiRouter {

    private router: Router = Router();

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.get('/', (req: Request, res: Response) => res.json({
            message: `HELLO VISITOR, THANK YOU FOR VISITING`
        }));

        this.router.use('/accounts', new AccountRouter().getRoutes());
        this.router.use('/auth', new AuthRouter().getRoutes());
        this.router.use('/transactions', new TransactionRouter().getRoutes());
        this.router.use('/users', new UserRouter().getRoutes());
    };

    public getRoutes() {
        return this.router;
    }
}