import { NextFunction, Request, Response } from 'express';
import { AuthService } from '@services/auth.service';
import { validateRequest } from '@helpers/validateRequest';
import {
    ChangePasswordDto,
    LoginUserDto,
    ResetPasswordDto,
    ValidEmailDto
} from '@dtos/auth.dto';
import { SuccessResponse } from '@helpers/successResponse';
import { logger } from '@helpers/logger';
import { LoggerException } from '@exceptions/common.exceptions';
import { RequestWithUser } from '@interfaces/route.interface';
import { Controller } from '@decorators/generic.decorator';


@Controller()
export class AuthController {

    protected readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
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

    public changePassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { id } = req.user;

            const changePasswordDto = await validateRequest(ChangePasswordDto, req.body);

            await this.authService.changePassword(id, changePasswordDto);

            res.status(200).json(new SuccessResponse(200, 'Password Changed'));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public sendPasswordResetLink = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email } = await validateRequest(ValidEmailDto, req.body);

            await this.authService.sendPasswordResetLink(email);

            res.status(200).json(new SuccessResponse(200, `Password Reset Link Sent to ${email}`));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const resetPasswordDto = await validateRequest(ResetPasswordDto, req.body);

            await this.authService.resetPassword(resetPasswordDto);

            res.status(200).json(new SuccessResponse(200, `Password Reset Successful`));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }
}