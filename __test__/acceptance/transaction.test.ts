import request from 'supertest';
import { Server } from 'http';
import { AppDataSource } from '@/data-source';
import { App } from '@/app';
import { ENV } from '@config/configuration';


const app = new App().getApp();
let server: Server;
let accessToken: string = ''


describe('Transaction Routes', () => {

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

    describe('GET /transactions', () => {

        it('Should Return All Transactions and data in Response Body must be an Array', async () => {

            const response = await request(app)
                .get('/v1/transactions')
                .auth(accessToken, { type: 'bearer' });

            expect(response.status).toEqual(200);

            expect(response.body.status).toEqual('success');

            expect(response.body.statusCode).toEqual(200);

            expect(Array.isArray(response.body.data)).toBe(true)

        });

        it('Should return an UnAuthorized Error Response if an invalid token is passed with the request', async () => {

            const response = await request(app)
                .get('/v1/transactions')
                .auth('invalidToken', { type: 'bearer' });

            expect(response.status).toEqual(401);

            expect(response.text).toEqual('Unauthorized');

        });

    })

    describe('GET /transactions/reference', () => {

        it('Should get transaction details by transaction reference', async () => {

            const response = await request(app)
                .get('/v1/transactions/reference')
                .send({ transactionRef: '<valid-transaction-reference>' })
                .auth(accessToken, { type: 'bearer' });

            expect(response.status).toEqual(200);

            expect(response.body.status).toEqual('success');

            expect(response.body.statusCode).toEqual(200);

            expect(response.body.message).toEqual('Transaction Details')

            expect(response.body).toHaveProperty('data')

        });

        it('Should return an UnAuthorized Error Response if an invalid token is passed with the request', async () => {

            const response = await request(app)
                .get('/v1/transactions/reference')
                .send({ transactionRef: 'DEBIT: FUNDS-TRANSFER-16775767678859586778' })
                .auth('invalidToken', { type: 'bearer' });

            expect(response.status).toEqual(401);

            expect(response.text).toEqual('Unauthorized');

        });

    });

})