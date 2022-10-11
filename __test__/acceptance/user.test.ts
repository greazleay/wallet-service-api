import request from 'supertest';
import { Server } from 'http';
import { AppDataSource } from '@/data-source';
import { App } from '@/app';
import { ENV } from '@config/configuration';


const app = new App().getApp();
let server: Server;
let accessToken: string = ''


describe('User Routes', () => {

    beforeAll(async () => {

        await AppDataSource.initialize();

        server = app.listen(ENV.PORT);

        // Fix for EADDRINUSE error during tests
        server.on('error', (e: NodeJS.ErrnoException) => {

            if (e.code === 'EADDRINUSE') {

                setTimeout(() => {
                    server.close();
                    server.listen(ENV.PORT);
                }, 3000);

            }
        });

        accessToken = (await request(app)
            .post('/v1/auth/login')
            .send({
                email: '<valid-email>',
                password: '<valid-password>'
            })
            .retry(2)
        ).body.data;

    });

    afterAll(async () => {

        await AppDataSource.destroy();

        server.close()

    })

    describe('GET /users', () => {

        it('Should Return All Users and data in Response Body must be an Array', async () => {

            const response = await request(app)
                .get('/v1/users')
                .auth(accessToken, { type: 'bearer' });

            expect(response.status).toEqual(200);

            expect(response.body.status).toEqual('success');

            expect(response.body.statusCode).toEqual(200);

            expect(Array.isArray(response.body.data)).toBe(true);

            expect(response.body.data.length).toBeGreaterThan(0)

        });

        it('Should return an UnAuthorized Error Response if an invalid token is passed with the request', async () => {

            const response = await request(app)
                .get('/v1/users')
                .auth('invalidToken', { type: 'bearer' });

            expect(response.status).toEqual(401);

            expect(response.text).toEqual('Unauthorized');

        });

    })

    describe('POST /users/register', () => {

        it('Should return a validation error if request body is empty', async () => {

            const res = await request(app)
                .post('/v1/users/register')
                .send();

            expect(res.status).toBe(400);

            expect(res.body.errors).not.toBeNull();

        });
    })

    describe('GET /users/userinfo', () => {

        it('Should return an unauthorized error if an invalid token is passed with the request', async () => {

            const response = await request(app)
                .get('/v1/users/userinfo')
                .auth('invalidToken', { type: 'bearer' });

            expect(response.status).toEqual(401);

            expect(response.text).toEqual('Unauthorized');

        });

        it('Should return the user info if a valid token is passed with the request', async () => {

            const response = await request(app)
                .get('/v1/users/userinfo')
                .auth(accessToken, { type: 'bearer' });

            expect(response.status).toEqual(200);

            expect(response.body.status).toEqual('success');

            expect(response.body.statusCode).toEqual(200);

            expect(response.body.data).toHaveProperty('email')

        })
    });

})