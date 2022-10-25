import { NextFunction, Request, Response } from 'express';
import { UserService } from '@services/user.service';
import { validateRequest } from '@helpers/validateRequest';
import { CreateUserDto, UpdateUserDto } from '@dtos/user.dto';
import { RequestWithUser } from '@interfaces/route.interface';
import { SuccessResponse } from '@/helpers/successResponse';


export class UserController {

    private readonly userService: UserService = new UserService();

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const createUserDto = await validateRequest(CreateUserDto, req.body);

            const responseData = await this.userService.create(createUserDto);

            res.status(201).json(new SuccessResponse(201, 'User Created Successfully', responseData));

        } catch (error) {
            next(error)
        }
    }

    public getCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            res.status(200).json(new SuccessResponse(200, 'User Info', req.user));

        } catch (error) {
            next(error)
        }
    }

    public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user

            const updateUserDto = await validateRequest(UpdateUserDto, req.body);

            const responseData = await this.userService.updateUser(id, updateUserDto);

            res.status(200).json(new SuccessResponse(200, 'User Updated', responseData));

        } catch (error) {
            next(error)
        }
    }

    public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user

            await this.userService.deleteUser(id);

            res.status(200).json(new SuccessResponse(200, 'User Deleted'));

        } catch (error) {
            next(error)
        }
    }
}