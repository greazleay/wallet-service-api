import request from 'supertest';
import { Server } from 'http';
import { AppDataSource } from '@/data-source';
import { App } from '@/app';
import { ENV } from '@config/configuration';


const app = new App().getApp();
let server: Server;

describe('Authentication Routes', () => {

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

    });

    afterAll(async () => {

        await AppDataSource.destroy();

        server.close()

    })

    describe('POST /auth/login', () => {

        it('Should Successfully login the user with a valid email/password combination', async () => {

            const response = await request(app)
                .post('/v1/auth/login')
                .send({
                    email: 'valid-email',
                    password: 'valid-password'
                })
                .retry(2);

            expect(response.status).toEqual(200);

            expect(response.body).toEqual({
                data: expect.any(String),
                message: expect.any(String),
                status: 'success',
                statusCode: 200
            });

        });

        it('Should return a Bad Request Error if the email is not provided', async () => {

            const response = await request(app)
                .post('/v1/auth/login')
                .send({ password: 'valid-password' })
                .retry(2);

            expect(response.status).toEqual(400);

            expect(response.body).toEqual({
                "error": "Validation Errors",
                "statusCode": 400,
                "name": "ValidationException",
                "errors": expect.anything()
            });

        });

        it('Should return a Bad Request Error if the password is not provided', async () => {

            const response = await request(app)
                .post('/v1/auth/login')
                .send({ email: 'test@example.com' })
                .retry(2);

            expect(response.status).toEqual(400);

            expect(response.body).toEqual({
                "error": "Validation Errors",
                "statusCode": 400,
                "name": "ValidationException",
                "errors": [
                    {
                        "property": "password",
                        "error": {
                            "isString": "password must be a string",
                            "isNotEmpty": "password should not be empty"
                        }
                    }
                ]
            });

        });

        it('Should return an UnAuthorized Error Response if the email is not registered', async () => {

            const response = await request(app)
                .post('/v1/auth/login')
                .send({
                    email: 'unregistered-email',
                    password: 'valid-password'
                })
                .retry(2);

            expect(response.status).toEqual(401);

            expect(response.body).toEqual({
                "error": "Invalid Credentials",
                "name": "UnAuthorizedException",
                "statusCode": 401
            });

        });

        it('Should return an UnAuthroized Error Response if the password is incorrect', async () => {

            const response = await request(app)
                .post('/v1/auth/login')
                .send({
                    email: 'valid-email',
                    password: 'invalid-password'
                }
                )
                .retry(2);

            expect(response.status).toEqual(401);

            expect(response.body).toEqual({
                "error": "Invalid Credentials",
                "name": "UnAuthorizedException",
                "statusCode": 401
            });

        });
    })
})