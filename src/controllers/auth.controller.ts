import { NextFunction, Request, Response } from 'express';
import { AuthService } from '@services/auth.service';
import { validateRequest } from '@helpers/validateRequest';
import { LoginUserDto } from '@dtos/auth.dto';
import { SuccessResponse } from '@helpers/successResponse';


export class AuthController {

    private readonly authService: AuthService = new AuthService();

    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const loginUserDto = await validateRequest(LoginUserDto, req.body);

            const responseData = await this.authService.login(loginUserDto);

            res.status(200).json(new SuccessResponse(200, 'Login Successful', responseData));

        } catch (error) {
            next(error)
        }
    }
}