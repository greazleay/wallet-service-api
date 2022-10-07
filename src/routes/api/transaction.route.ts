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
         * THIS ROUTE RETURNS ALL TRANSACTIONS ON THE SERVER.
         * PLEASE NOTE THAT THE ROUTE IS LEFT OPEN WITHOUT AUTHORIZATION DELIBERATELY FOR THE PURPOSE OF THIS TASK.
         */
        this.router.get(
            '/',
            passport.authenticate('jwt', { session: false }),
            this.transactionController.getAllTransactions
        );

        this.router.get(
            '/account',
            passport.authenticate('jwt', { session: false }),
            this.transactionController.getAllOnAccountByUser
        );

        this.router.get(
            '/account-date',
            passport.authenticate('jwt', { session: false }),
            this.transactionController.getAllOnAccountByUserAndDate
        );

        this.router.get(
            '/reference',
            passport.authenticate('jwt', { session: false }),
            this.transactionController.getOneByTransactionRef
        );

        /**
         * THIS ROUTE RETURNS A TRANSACTION WITH THE GIVEN TRANSACTION ID.
         * PLEASE NOTE THAT THE ROUTE IS LEFT OPEN WITHOUT AUTHORIZATION DELIBERATELY FOR THE PURPOSE OF THIS TASK.
         */
        this.router.get(
            '/:transactionId',
            passport.authenticate('jwt', { session: false }),
            this.transactionController.getOneById
        );

    };

    public getRoutes() {
        return this.router;
    }
}