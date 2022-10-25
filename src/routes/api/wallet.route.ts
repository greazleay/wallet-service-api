import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/route.interface';
import { WalletController } from '@controllers/wallet.controller';


export class WalletRouter {

    private readonly router: CustomIRouter = Router();
    private readonly walletController = new WalletController()

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.use(passport.authenticate('jwt', { session: false }));
        
        this.router.post(
            '/',
            this.walletController.createWallet
        );

        this.router.post(
            '/deposit',
            this.walletController.depositFunds
        );

        this.router.post(
            '/withdraw',
            this.walletController.withdrawFunds
        );

        this.router.post(
            '/transfer',
            this.walletController.transferFunds
        );

        this.router.get(
            '/user',
            this.walletController.getByUser
        );

        this.router.get(
            '/wallet-number',
            this.walletController.getOneByWalletNumber
        );

        this.router.get(
            '/balance',
            this.walletController.getWalletBalance
        );

    };

    public getRoutes() {
        return this.router;
    }
}