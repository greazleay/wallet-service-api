import { NextFunction, Request, Response } from 'express';
import { AuthService } from '@services/auth.service';
import { validateRequest } from '@helpers/validateRequest';
import { LoginUserDto } from '@dtos/auth.dto';


export class AuthController {

    private readonly authService: AuthService = new AuthService();

    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const loginUserDto = await validateRequest(LoginUserDto, req.body);

            const responseData = await this.authService.login(loginUserDto);

            res.status(200).json(responseData)

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}