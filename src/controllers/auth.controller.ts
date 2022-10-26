import { NextFunction, Request, Response } from 'express';
import { AuthService } from '@services/auth.service';
import { validateRequest } from '@helpers/validateRequest';
import { LoginUserDto } from '@dtos/auth.dto';
import { SuccessResponse } from '@helpers/successResponse';
import { logger } from '@helpers/logger';
import { LoggerException } from '@exceptions/common.exceptions';


export class AuthController {

    public readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService()
    }

    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const loginUserDto = await validateRequest(LoginUserDto, req.body);

            const responseData = await this.authService.login(loginUserDto);

            res.status(200).json(new SuccessResponse(200, 'Login Successful', responseData));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }
}