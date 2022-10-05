import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { App } from '@/app';
import { ENV } from '@config/configuration';

const PORT = ENV.PORT || 4000;

AppDataSource.initialize().then(async () => {

    (new App().getApp()).listen(PORT, (): void => {
        console.log(`listening on port ${PORT}`);
    });

}).catch(error => console.log(error))