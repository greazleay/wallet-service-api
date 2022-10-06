import { User } from '@entities/user.entity';
import { IRouter, Request } from 'express';

export interface RequestWithUser extends Request {
    user: User;
}

export type CustomIRouter = IRouter & {
    get: (path: string, ...middlewares: any[]) => IRouter;
    post: (path: string, ...middlewares: any[]) => IRouter;
    put: (path: string, ...middlewares: any[]) => IRouter;
    delete: (path: string, ...middlewares: any[]) => IRouter;
}
