import { NextFunction, Request, Response } from 'express';
import { AuthService } from '@services/auth.service';
import { validateRequest } from '@helpers/validateRequest';
import { LoginUserDto } from '@dtos/auth.dto';

const authService: AuthService = new AuthService();

export class AuthController {

    public async loginUser(req: Request, res: Response, next: NextFunction) {
        try {

            const loginUserDto = await validateRequest(LoginUserDto, req.body);

            const responseData = await authService.login(loginUserDto);

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    }
}