import passport from 'passport';
import { BaseRouter } from '../base.router';
import { WalletController } from '@controllers/wallet.controller';


export class WalletRouter extends BaseRouter {

    private readonly walletController: WalletController

    constructor() {
        super()
        
        this.walletController = new WalletController();
        this.registerRoutes()
    }

    protected registerRoutes() {

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

}