import { Router } from 'express';
import { CustomIRouter } from '@interfaces/route.interface';


export class AccountRouter {

    private router: CustomIRouter = Router();

    public getRoutes() {
        return this.router;
    }
}