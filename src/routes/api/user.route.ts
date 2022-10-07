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

        /**
         * THIS ROUTE RETURNS ALL USERS ON THE SERVER.
         * PLEASE NOTE THAT THE ROUTE IS LEFT OPEN WITHOUT AUTHORIZATION DELIBERATELY FOR THE PURPOSE OF THIS TASK.
         */
        this.router.get(
            '/',
            passport.authenticate('jwt', { session: false }),
            this.userController.getAllUsers
        );

        this.router.get(
            '/userinfo',
            passport.authenticate('jwt', { session: false }),
            this.userController.getCurrentUser
        );

    };

    public getRoutes() {
        return this.router;
    }
}