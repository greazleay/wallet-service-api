import { DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from '@entities/transaction.entity';
import { User } from '@entities/user.entity';
import { ENV } from '@config/configuration';
import { ResetToken } from './entities/resetToken.entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_DATABASE,
    entities: [ResetToken, Transaction, User, Wallet],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: false,
    ssl: {
        rejectUnauthorized: false
    },
    connectTimeout: 30000,
    timezone: 'Z',
    extra: {
        connectionLimit: 1000
    }
});

export const entityManager = AppDataSource.manager;
export const resetTokenRepository = AppDataSource.getRepository(ResetToken);
export const transactionRepository = AppDataSource.getRepository(Transaction);
export const userRepository = AppDataSource.getRepository(User);
export const walletRepository = AppDataSource.getRepository(Wallet);

// Experimental feature
export const TestDataSource = new DataSource({
    type: 'better-sqlite3',
    database: ':memory:',
    entities: [ResetToken, Transaction, User, Wallet],
    synchronize: true,
    logging: false
})