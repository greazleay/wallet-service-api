import passport from 'passport';
import { BaseRouter } from '../base.router';
import { UserController } from '@controllers/user.controller';


export class UserRouter extends BaseRouter {

    private readonly userController: UserController;

    constructor() {
        super();
        
        this.userController = new UserController();
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

}