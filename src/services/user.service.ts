import { CreateUserDto, UpdateUserDto } from '@dtos/user.dto';
import { userRepository } from '@/data-source';
import { ConflictException, NotFoundException } from '@exceptions/common.exceptions';
import { User } from '@entities/user.entity';

export class UserService {

    private readonly userRepo: typeof userRepository = userRepository;

    public async create(createUserDto: CreateUserDto): Promise<User> {

        const { email } = createUserDto;

        const userExists = await this.userRepo.findOneBy({ email });

        if (userExists) {
            throw new ConflictException(`User with email ${email} already exists on the server`)
        }

        const newUser = this.userRepo.create(createUserDto);
        await this.userRepo.save(newUser);

        return newUser;

    };

    public async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {

        const userToUpdate = await this.userRepo.findOneBy({ id });

        if (userToUpdate) {

            const updatedUser = Object.assign(userToUpdate, updateUserDto)

            await this.userRepo.save(updatedUser)

            return updatedUser

        } else {

            throw new NotFoundException(`User with id: ${id} not found`)
        }
    }

    public async deleteUser(id: string): Promise<boolean> {

        const userToDelete = await this.userRepo.findOneBy({ id });

        if (userToDelete) {

            await this.userRepo.remove(userToDelete)

            return true

        } else {

            throw new NotFoundException(`User with id: ${id} not found`)
        }
    }

    public async findUserByEmail(email: string): Promise<User> {

        return this.userRepo.findOneBy({ email })
    }

}