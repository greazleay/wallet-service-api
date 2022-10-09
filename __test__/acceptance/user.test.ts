import { AppDataSource } from '@/data-source';
import { App } from '@/app';
import request from 'supertest';


const app = new App().getApp();
const server = app.listen(4000)

beforeAll(async () => {

    await AppDataSource.initialize();

});

afterAll(async () => {

    await AppDataSource.destroy();
    server.close()
})

describe('User Routes', () => {

    describe('GET /userinfo', () => {

        it('should return an unauthorized error if an invalid token is passed with the request', async () => {
            const response = await request(app).get('/v1/users/userinfo').auth('fakeToken', { type: 'bearer' });

            expect(response.status).toEqual(401);
            expect(response.text).toEqual('Unauthorized');
        });

        it('should return the user info if a valid token is passed with the request', async () => {

            const token = (await request(app).post('/v1/auth/login').send({ email: 'labeight@affecting.org', password: 'password123' }).retry(2)).body.data;
            const response = await request(app).get('/v1/users/userinfo').auth(token, { type: 'bearer' });

            expect(response.status).toEqual(200);
            expect(response.body.status).toEqual('success');
            expect(response.body.statusCode).toEqual(200);
        })
    });

    describe('POST /users/register', () => {

        it('Should return a validation error if request body is empty', async () => {
            const res = await request(app).post('/v1/users/create').send();
            expect(res.status).toBe(400);
            expect(res.body.errors).not.toBeNull();
        });
    })

})