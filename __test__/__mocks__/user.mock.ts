import { User } from "@entities/user.entity";

export const testUser = {
    email: 'test@example.com',
    fullName: 'John Doe',
    lastLogin: new Date(),
    roles: ['ADMIN', 'USER']
} as unknown as User;

export const newTestUser = {
    email: 'newuser@example.com',
    fullName: 'John Doe',
    lastLogin: new Date(),
    roles: ['ADMIN', 'USER']
} as unknown as User;

