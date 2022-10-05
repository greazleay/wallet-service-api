import { DataSource } from 'typeorm';
import { Account } from './entities/account.entity';
import { Transaction } from '@entities/transaction.entity';
import { User } from '@entities/user.entity';
import { ENV } from '@config/configuration';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_DATABASE,
    entities: [Account, Transaction, User],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: false,
    ssl: {
        rejectUnauthorized: false
    }
});

export const accountRepository = AppDataSource.getRepository(Account);
export const transactionRepository = AppDataSource.getRepository(Transaction);
export const userRepository = AppDataSource.getRepository(User);
