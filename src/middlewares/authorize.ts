import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../interfaces/route.interface';
import { ForbiddenException } from '@exceptions/common.exceptions';
import { Role } from '@interfaces/user.interface';

export class Authorize {

    public static async admin(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const { roles } = req.user;

            if (roles.indexOf(Role.ADMIN) !== -1) {
                next();
            } else {
                throw new ForbiddenException('User not authorized to access this resource')
            }

        } catch (err) {
            next(err)
        };
    };

}