import { DataSource } from 'typeorm';   // IMPORTED FOR MOCKING, DO NOT REMOVE
import { UserService } from '@/services/user.service';
import { newTestUser, testUser } from '../__mocks__/user.mock'
import { CreateUserDto } from '@dtos/user.dto';

jest.mock('typeorm', () => {

    const originalModule = jest.requireActual<typeof import('typeorm')>('typeorm');

    return {
        ...originalModule,
        DataSource: jest.fn().mockImplementation(() => {
            return {
                BaseEntity: jest.fn(),
                getRepository: jest.fn().mockImplementation(() => {
                    return {
                        findOneBy: jest.fn().mockImplementation((inputObj: { email: string }) => {
                            return inputObj.email === testUser.email ? testUser : null
                        }),
                        create: jest.fn().mockImplementation(() => newTestUser),
                        save: jest.fn().mockImplementation(() => newTestUser)
                    }
                })
            }
        })
    }
});

describe('User Service', () => {

    const service = new UserService();

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('find user by email', () => {

        it('should return a user matching the specified email', async () => {

            const result = await service.findUserByEmail('test@example.com');

            expect(result).toStrictEqual(testUser)
        })
    })

    describe('create new user', () => {

        it('should create a new user', async () => {

            const createUserDto: CreateUserDto = {
                email: 'newuser@example.com',
                password: 'password123',
                fullName: 'John Doe'
            };

            const result = await service.create(createUserDto);

            expect(result).toMatchObject(newTestUser);
        })

        it('should throw a conflict error if a user with similar email address already exists', async () => {

            const createUserDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'password123',
                fullName: 'John Doe'
            };

            await expect(service.create(createUserDto))
                .rejects
                .toMatchObject({});
        })
    })

})