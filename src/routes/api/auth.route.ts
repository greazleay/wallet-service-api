import { Router } from 'express';
import { CustomIRouter } from '@interfaces/route.interface';
import { AuthController } from '@controllers/auth.controller';

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

    };

    public getRoutes() {
        return this.router;
    }
}