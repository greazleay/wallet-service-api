import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { App } from '@/app';
import { ENV } from '@config/configuration';
import { redisClient } from './config/cache';
import { logger } from '@helpers/logger';

const PORT = ENV.PORT || 4000;

AppDataSource.initialize()
    .then(async () => {

        (new App().getApp()).listen(PORT, (): void => {
            logger.info(`listening on port ${PORT}`);
        });

    }).then(async () => {

        redisClient.on('connect', () => logger.info('Redis Client Connected'))

        redisClient.on('error', (err) => logger.error('Redis Client Error', err));

        await redisClient.connect()

    })
    .catch(error => logger.error(error))