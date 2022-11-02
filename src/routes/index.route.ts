import { Request, Response } from 'express';
import { BaseRouter } from './base.router';


export class IndexRouter extends BaseRouter {

    constructor() {
        super();

        this.registerRoutes();
    }

    private registerRoutes() {
        this.router.get('/', (req: Request, res: Response) => res.redirect('/v1'));
    }
}