import { Router } from 'express';
import { CustomIRouter } from '@interfaces/route.interface';
import { AuthController } from '@controllers/auth.controller';
import passport from 'passport';


export class AuthRouter {

    private readonly router: CustomIRouter;
    private readonly authController: AuthController;

    constructor() {
        this.router = Router();
        this.authController = new AuthController();
        this.registerRoutes();
    }

    private registerRoutes() {

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

    public getRoutes() {
        return this.router;
    }
}