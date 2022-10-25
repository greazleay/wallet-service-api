import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/route.interface';
import { TransactionController } from '@controllers/transaction.controller';


export class TransactionRouter {

    private readonly router: CustomIRouter = Router();
    private readonly transactionController = new TransactionController()

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.use(passport.authenticate('jwt', { session: false }))
        
        this.router.get(
            '/wallet',
            this.transactionController.getAllOnWalletByUser
        );

        this.router.get(
            '/wallet/date',
            this.transactionController.getAllOnWalletByUserAndDate
        );

        this.router.get(
            '/wallet/date-range',
            this.transactionController.getAllOnWalletByUserAndDateRange
        );

        this.router.get(
            '/reference',
            this.transactionController.getOneByTransactionRef
        );

    };

    public getRoutes() {
        return this.router;
    }
}