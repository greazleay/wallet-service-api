import request from 'supertest';
import { Server } from 'http';
import { AppDataSource } from '@/data-source';
import { App } from '@/app';
import { ENV } from '@config/configuration';


const app = new App().getApp();
let server: Server;
let accessToken: string = '';

describe('Accounts Routes', () => {

    beforeAll(async () => {

        await AppDataSource.initialize();

        server = app.listen(ENV.PORT)

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

    describe('GET /accounts', () => {

        it('Should return All Accounts if a valid token is passed with the request', async () => {

            const response = await request(app)
                .get('/v1/accounts')
                .auth(accessToken, { type: 'bearer' });

            expect(response.status).toEqual(200);

            expect(response.body.status).toEqual('success');

            expect(response.body.statusCode).toEqual(200);

            expect(Array.isArray(response.body.data)).toBe(true);

            expect(response.body.data.length).toBeGreaterThan(0)

        });

        it('Should return an UnAuthorized Error Response if an invalid token is passed with the request', async () => {

            const response = await request(app)
                .get('/v1/accounts')
                .auth('invalidToken', { type: 'bearer' });

            expect(response.status).toEqual(401);

            expect(response.text).toEqual('Unauthorized');

        });
    });

    describe('POST /accounts/deposit-funds', () => {

        it('Should make a successful deposit with valid transaction details', async () => {

            const response = await request(app)
                .post('/v1/accounts/deposit-funds')
                .send({
                    accountName: '<valid-account-name>',
                    accountNumber: '<10-digit-account-number>',
                    transactionAmount: '<amount-to-transfer>',
                    transactionParty: '<individual-making-the-transfer>'
                })
                .auth(accessToken, { type: 'bearer' });

            expect(response.status).toBe(200);

            expect(response.body.status).toEqual('success');

            expect(response.body.statusCode).toEqual(200);

            expect(response.body.data).toHaveProperty('accountNumber')

            expect(response.body.data).toHaveProperty('reference')

        });
    })

    describe('POST /accounts/withdraw-funds', () => {

        it('Should make a successful withdrawal with valid transaction details', async () => {

            const response = await request(app)
                .post('/v1/accounts/withdraw-funds')
                .send({
                    accountName: '<valid-account-name>',
                    accountNumber: '<10-digit-account-number>',
                    transactionAmount: '<amount-to-transfer>',
                    transactionParty: '<individual-making-the-transfer>'
                })
                .auth(accessToken, { type: 'bearer' });

            expect(response.status).toBe(200);

            expect(response.body.status).toEqual('success');

            expect(response.body.statusCode).toEqual(200);

            expect(response.body.data).toHaveProperty('accountNumber')

            expect(response.body.data).toHaveProperty('reference')

        });
    })

    describe('POST /accounts/transfer-funds', () => {

        it('Should make a successful funds transfer with valid transaction details', async () => {

            const response = await request(app)
                .post('/v1/accounts/withdraw-funds')
                .send({
                    accountName: '<valid-account-name>',
                    accountNumber: '<10-digit-account-number>',
                    transactionAmount: '<amount-to-transfer>',
                    transactionParty: '<individual-making-the-transfer>'
                })
                .auth(accessToken, { type: 'bearer' });

            expect(response.status).toBe(200);

            expect(response.body.status).toEqual('success');

            expect(response.body.statusCode).toEqual(200);

            expect(response.body.data).toHaveProperty('accountNumber')

            expect(response.body.data).toHaveProperty('reference')

        });
    })

})