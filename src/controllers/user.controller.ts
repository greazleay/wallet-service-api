import { NextFunction, Request, Response } from 'express';
import { UserService } from '@services/user.service';
import { validateRequest } from '@helpers/validateRequest';
import { CreateUserDto } from '@dtos/user.dto';
import { RequestWithUser } from '@interfaces/route.interface';
import { SuccessResponse } from '@/helpers/successResponse';


const userService: UserService = new UserService();

export class UserController {

    public async createUser(req: Request, res: Response, next: NextFunction) {
        try {

            const createUserDto = await validateRequest(CreateUserDto, req.body);

            const responseData = await userService.create(createUserDto);

            res.status(201).json(responseData);

        } catch (error) {
            next(error)
        }
    }

    public async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {

            const responseData = await userService.findAll();

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    }

    public async getCurrentUser(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            
            res.status(200).json(new SuccessResponse(200, 'User Info', req.user));

        } catch (error) {
            next(error)
        }
    }
}