import { Router } from 'express';
import { CustomIRouter } from '@interfaces/route.interface';


export class BaseRouter {

    protected readonly router: CustomIRouter;

    constructor() {
        this.router = Router();
    }

    public getRoutes() {
        return this.router;
    }
}