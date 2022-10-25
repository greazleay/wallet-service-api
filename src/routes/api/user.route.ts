import { Router } from 'express';
import { CustomIRouter } from '@interfaces/route.interface';
import { UserController } from '@controllers/user.controller';
import passport from 'passport';


export class UserRouter {

    private readonly router: CustomIRouter = Router();
    private readonly userController = new UserController();

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.post(
            '/register',
            this.userController.createUser
        );

        this.router.get(
            '/userinfo',
            passport.authenticate('jwt', { session: false }),
            this.userController.getCurrentUser
        );

        this.router.patch(
            '/:id',
            passport.authenticate('jwt', { session: false }),
            this.userController.updateUser
        );

        this.router.delete(
            '/:id',
            passport.authenticate('jwt', { session: false }),
            this.userController.deleteUser
        );

    };

    public getRoutes() {
        return this.router;
    }
}