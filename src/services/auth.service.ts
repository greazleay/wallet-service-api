import { userRepository, resetTokenRepository } from '@/data-source';
import { ResetToken } from '@entities/resetToken.entity';
import { NotFoundException, UnAuthorizedException } from '@/exceptions/common.exceptions';
import { ChangePasswordDto, LoginUserDto, ResetPasswordDto } from '@dtos/auth.dto';
import { frontEndUrl } from '@config/constants';
import { sendMail } from '@helpers/email/sendMail';
import { passwordResetTemplate } from '@helpers/email/templates/passwordReset';

export class AuthService {

    private readonly userRepo: typeof userRepository = userRepository;

    private readonly resetTokenRepo: typeof resetTokenRepository = resetTokenRepository;

    public async login(loginUserDto: LoginUserDto): Promise<string> {

        const { email, password } = loginUserDto;

        // Check if the user Exists
        const userExists = await this.userRepo.findOneBy({ email });

        if (userExists && await userExists.isPasswordValid(password)) {

            userExists.lastLogin = new Date();
            await userExists.save();

            const authToken = await userExists.generateToken()

            return authToken

        } else {

            throw new UnAuthorizedException('Invalid Credentials')
        }
    };

    public async changePassword(id: string, changePasswordDto: ChangePasswordDto) {

        const { currentPassword, newPassword } = changePasswordDto;
        const userExists = await this.userRepo.findOneBy({ id });

        if (userExists && await userExists.isPasswordValid(currentPassword)) {

            await userExists.updatePassword(newPassword);

            return true;

        } else {

            throw new UnAuthorizedException('Invalid Credentials')

        }
    };

    private async sendLinkToEmail(entity: ResetToken, email: string, firstName: string) {

        const resetToken = await entity.generateResetToken();

        const resetLink = `${frontEndUrl}/password-reset?token=${resetToken}`

        const mailOptions: [string, string, string] = [
            email,
            'Password Reset Link',
            `${passwordResetTemplate(firstName, resetLink)}`,
        ];

        await sendMail(...mailOptions);

        return true
    }

    public async sendPasswordResetLink(email: string) {

        const userExists = await userRepository.findOneBy({ email });

        if (userExists) {

            const prevToken = await this.resetTokenRepo.findOneBy({ email });

            if (prevToken) {

                const { email, fullName } = userExists;

                return await this.sendLinkToEmail(prevToken, email, fullName);

            } else {

                const newResetToken = this.resetTokenRepo.create({ email });

                const { email: userEmail, fullName } = userExists;

                return await this.sendLinkToEmail(newResetToken, userEmail, fullName);

            }

        } else {

            throw new UnAuthorizedException('Invalid Credentials')

        }
    };

    public async resetPassword(resetPasswordDto: ResetPasswordDto) {

        const { email, token, newPassword } = resetPasswordDto;

        const prevToken = await resetTokenRepository.findOneBy({ email });

        if (prevToken && await prevToken.isResetTokenValid(token)) {

            const userExists = await userRepository.findOneBy({ email });

            if (userExists) {

                await userExists.updatePassword(newPassword);
                
                await resetTokenRepository.remove(prevToken);
                
                return true
            }

            throw new UnAuthorizedException('Invalid Credentials');

        } else {
            
            throw new UnAuthorizedException('Invalid Credentials');

        }
    }
}