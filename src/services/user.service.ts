import { CreateUserDto } from '@dtos/user.dto';
import { userRepository } from '@/data-source';
import { ConflictException } from '@exceptions/common.exceptions';
import { SuccessResponse } from '@helpers/successResponse'

export class UserService {

    private readonly userRepo: typeof userRepository = userRepository;

    public async create(createUserDto: CreateUserDto): Promise<SuccessResponse> {

        const { email } = createUserDto;

        const userExists = await this.userRepo.findOneBy({ email });

        if (userExists) {
            throw new ConflictException(`User with email ${email} already exists on the server`)
        }

        const newUser = this.userRepo.create(createUserDto);
        await this.userRepo.save(newUser);

        return new SuccessResponse(201, 'User Created Successfully');

    }

    public async findAll(): Promise<SuccessResponse> {

        const allUsers = await this.userRepo.find({
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true
            },
            order: {
                createdAt: 'DESC'
            }
        })

        return new SuccessResponse(200, 'All Users', allUsers);
    }
}