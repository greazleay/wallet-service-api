import { cleanEnv, num, str } from 'envalid';
import { config } from 'dotenv';
import { CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit'

config();

export const ENV = cleanEnv(process.env, {

    PORT: num(),

    DB_HOST: str(),
    DB_PORT: num(),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_DATABASE: str(),

    COOKIE_SECRET: str(),
    ACCESS_TOKEN_SECRET: str(),

    LOGTAIL_SOURCE_TOKEN: str(),

    REDIS_HOST: str(),
    REDIS_USERNAME: str(),
    REDIS_PASSWORD: str(),

    EMAIL_HOST: str(),
    EMAIL_PORT: num(),
    EMAIL_API_KEY: str()

});

const whitelist = ['http://localhost:3000'];
export const corsOptions: CorsOptions = {
    credentials: true,
    methods: ['GET', 'DELETE', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
    origin: (requestOrigin: string | undefined, callback) => {
        if (whitelist.indexOf(requestOrigin as string) !== -1 || !requestOrigin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
    skipSuccessfulRequests: true,
    skip: (req, res) => whitelist.includes(req.headers.origin as string)
})