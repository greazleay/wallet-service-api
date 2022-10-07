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

        
        /**
         * THIS ROUTE RETURNS ALL TRANSACTIONS ON THE SERVER
         * PLEASE NOTE THAT THE ROUTE LEFT IS OPEN DELIBERATELY WITHOUT AUTHORIZATION FOR THE PURPOSE OF THIS TASK
         */
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