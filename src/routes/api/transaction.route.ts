import passport from 'passport';
import { BaseRouter } from '../base.router';
import { TransactionController } from '@controllers/transaction.controller';


export class TransactionRouter extends BaseRouter {

    private readonly transactionController: TransactionController

    constructor() {
        super()
        
        this.transactionController = new TransactionController();
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.use(passport.authenticate('jwt', { session: false }));

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

}