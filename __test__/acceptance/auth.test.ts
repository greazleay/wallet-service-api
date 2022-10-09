import { User } from '@entities/user.entity';
import { AppDataSource } from '@/data-source';
import { App } from '@/app';
import request from 'supertest';

let connection: Connection, server: Server;
const app = new App().getApp();

const testCustomer = {
    firstName: 'John',
    lastName: 'Doe',
    age: 48,
    address: 'Plot 45A, Lorem Street, Ipsium'
}

const testCustomerNoFirstName = {
    lastName: 'Doe',
    age: 48,
    address: 'Plot 45A, Lorem Street, Ipsium'
}

beforeAll(async () => {
    connection = await createConnection();
    // Clear Database
    await connection.synchronize(true);
    server = app.listen(3000);
});

afterAll(() => {
    connection.close();
    server.close();
})

describe('auth', () => {
    it('should resolve with true and valid userId for hardcoded token', async () => {
        const response = await user.auth('fakeToken')
        expect(response).toEqual({ userId: 'fakeUserId' })
    })

    it('should resolve with false for invalid token', async () => {
        const response = await user.auth('invalidToken')
        expect(response).toEqual({ error: { type: 'unauthorized', message: 'Authentication Failed' } })
    })
})