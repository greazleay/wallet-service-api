import { Router } from 'express';
import { CustomIRouter } from '@interfaces/route.interface';


export class UserRouter {

    private router: CustomIRouter = Router();

    public getRoutes() {
        return this.router;
    }
}