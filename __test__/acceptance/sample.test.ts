import { User } from '@entities/user.entity';
import { AppDataSource } from '@/data-source';
import { App } from '@/app';
import request from 'supertest';

let connection: Connection, server: Server;
const app = new App().getApp();

describe('GET /hello', () => {
    it('should return 200 & valid response if request param list is empity', async done => {
        request(server)
            .get(`/api/v1/hello`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'message': 'Hello, stranger!' })
                done()
            })
    })

    it('should return 200 & valid response if name param is set', async done => {
        request(server)
            .get(`/api/v1/hello?name=Test%20Name`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'message': 'Hello, Test Name!' })
                done()
            })
    })

    it('should return 400 & valid error response if name param is empty', async done => {
        request(server)
            .get(`/api/v1/hello?name=`)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).toMatchObject({
                    'error': {
                        type: 'request_validation',
                        message: expect.stringMatching(/Empty.*\'name\'/),
                        errors: expect.anything()
                    }
                })
                done()
            })
    })
})

describe('GET /goodbye', () => {
    it('should return 200 & valid response to authorization with fakeToken request', async done => {
        request(server)
            .get(`/api/v1/goodbye`)
            .set('Authorization', 'Bearer fakeToken')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'message': 'Goodbye, fakeUserId!' })
                done()
            })
    })

    it('should return 401 & valid eror response to invalid authorization token', async done => {
        request(server)
            .get(`/api/v1/goodbye`)
            .set('Authorization', 'Bearer invalidFakeToken')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ error: { type: 'unauthorized', message: 'Authentication Failed' } })
                done()
            })
    })

    it('should return 401 & valid eror response if authorization header field is missed', async done => {
        request(server)
            .get(`/api/v1/goodbye`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({
                    'error': {
                        type: 'request_validation',
                        message: 'Authorization header required',
                        errors: expect.anything()
                    }
                })
                done()
            })
    })
})