import { Router } from 'express';
import { CustomIRouter } from '@interfaces/route.interface';
import { AuthController } from '@controllers/auth.controller';

export class AuthRouter {

    private router: CustomIRouter = Router();
    private authController = new AuthController();

    constructor() {
        this.registerRoutes()
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