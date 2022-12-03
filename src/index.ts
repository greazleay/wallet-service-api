import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { App } from '@/app';
import { ENV } from '@config/configuration';
import { connectRedis } from './config/cache';
import { logger } from '@helpers/logger';

const PORT = ENV.PORT || 4000;

AppDataSource.initialize()
    .then(() => {

        (new App().getApp()).listen(PORT, (): void => {
            logger.info(`listening on port ${PORT}`);
        });


    }).then(async () => {

        await connectRedis();

    })
    .catch(error => logger.error(error))