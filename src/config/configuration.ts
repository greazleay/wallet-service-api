import { cleanEnv, num, str } from 'envalid';
import { config } from 'dotenv';
import { CorsOptions } from 'cors';

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