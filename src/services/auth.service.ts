import { userRepository } from '@/data-source';
import { UnAuthorizedException } from '@/exceptions/common.exceptions';
import { LoginUserDto } from '@dtos/auth.dto';

export class AuthService {

    private readonly userRepo: typeof userRepository = userRepository;

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
}