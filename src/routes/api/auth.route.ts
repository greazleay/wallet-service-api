import passport from 'passport';
import { BaseRouter } from '../base.router';
import { AuthController } from '@controllers/auth.controller';
import { Route } from '@decorators/generic.decorator';


export class AuthRouter extends BaseRouter {

    private readonly authController: AuthController;

    constructor() {
        super()
        this.authController = new AuthController();
        this.registerRoutes();
    }

    protected registerRoutes() {

        this.router.post(
            '/login',
            this.authController.loginUser
        );

        this.router.post(
            '/change-password',
            passport.authenticate('jwt', { session: false }),
            this.authController.changePassword
        );

        this.router.post(
            '/password-reset-link',
            this.authController.sendPasswordResetLink
        );

        this.router.post(
            '/reset-password',
            this.authController.resetPassword
        );

    };

}