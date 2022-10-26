import { Request, Response, Router } from 'express';

export class IndexRouter {

    private router: Router;

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.router.get('/', (req: Request, res: Response) => res.redirect('/v1'));
    }

    public getRoutes() {
        return this.router;
    }
}