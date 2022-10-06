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

        this.router.get(
            '/',
            passport.authenticate('jwt', { session: false }),
            this.transactionController.getAllTransactions
        );

    };

    public getRoutes() {
        return this.router;
    }
}