import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/route.interface';
import { AccountController } from '@controllers/account.controller';


export class AccountRouter {

    private readonly router: CustomIRouter = Router();
    private readonly accountController = new AccountController()

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.get('/', passport.authenticate('jwt', { session: false }), this.accountController.getAllAccounts);
        this.router.get('/user-accounts', passport.authenticate('jwt', { session: false }), this.accountController.getByUser);
        this.router.get('/account-number', passport.authenticate('jwt', { session: false }), this.accountController.getOneByAccountNumber);
        this.router.get('/:accountId', passport.authenticate('jwt', { session: false }), this.accountController.getOneById);
        this.router.post('/open-account', passport.authenticate('jwt', { session: false }), this.accountController.openAccount);
    };

    public getRoutes() {
        return this.router;
    }
}