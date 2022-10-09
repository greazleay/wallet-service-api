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

describe('User Routes', () => {

    describe('GET /userinfo', () => {

        it('should return an unauthorized error if an invalid token is passed with the request', async () => {
            const response = await request(app).get('/v1/users/userinfo').auth('fakeToken', { type: 'bearer' });

            expect(response.status).toEqual(401);
            expect(response.text).toEqual('Unauthorized');
        });

        it('should return the user info if a valid token is passed with the request', async () => {

            const token = (await request(app).post('/v1/auth/login').send({ email: 'labeight@affecting.org', password: 'password123' }).retry(2)).body.authToken;
            const response = await request(app).get('/v1/users/userinfo').auth(token, { type: 'bearer' });

            expect(response.status).toEqual(200);
            expect(response.body.email).toEqual('labeight@affecting.org');
            expect(response.body.name).toEqual('Lab Eight');
            expect(response.body.roles).toEqual(['ADMIN']);
        })
    });

    describe('POST /users/register', () => {

        it('Should be no Customers initially', async () => {
            const response = await request(app).get('/customers');
            console.log(response.body);
        });

        it('Should Create a Customer', async () => {
            const response = await request(app).post('/customers').send(testCustomer);
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(testCustomer);
        });

        it('Should not create a user if firstName is omitted', async () => {
            const res = await request(app).post('/customers').send(testCustomerNoFirstName);
            expect(res.status).toBe(400);
            expect(res.body.errors).not.toBeNull();
            // expect(res.body.errors.length).toBe(1)
        });
    })

})