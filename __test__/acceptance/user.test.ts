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
                        findOneBy: jest.fn().mockImplementation(() => testUser),
                        save: jest.fn().mockImplementation(() => newTestUser)
                    }
                })
            }
        })
    }
});

describe('User Service', () => {

    const service = new UserService();

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe.skip('find user by email', () => {

        it('should return a user matching the specified email', async () => {

            const result = await service.findUserByEmail('test@test.com');

            expect(result).toStrictEqual(testUser)
        })
    })

    describe('create new user', () => {

        it.only('should create a new user', async () => {

            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
                fullName: 'John Doe'
            }

            expect(service.create(createUserDto))
                // .resolves
                .toMatchObject({})
        })

        it('should throw a conflict error if the user already exists', async () => {

            const createUserDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'password123',
                fullName: 'John Doe'
            }

            await expect(service.create(createUserDto))
                .rejects
                .toMatchObject({})
        })
    })

})