import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        moduleNameMapper: {
            "@/(.*)": "<rootDir>/src/$1",
            "@config/(.*)": "<rootDir>/src/config/$1",
            "@controllers/(.*)": "<rootDir>/src/controllers/$1",
            "@dtos/(.*)": "<rootDir>/src/dtos/$1",
            "@entities/(.*)": "<rootDir>/src/entities/$1",
            "@exceptions/(.*)": "<rootDir>/src/exceptions/$1",
            "@helpers/(.*)": "<rootDir>/src/helpers/$1",
            "@interfaces/(.*)": "<rootDir>/src/interfaces/$1",
            "@middlewares/(.*)": "<rootDir>/src/middlewares/$1",
            "@routes/(.*)": "<rootDir>/src/routes/$1",
            "@services/(.*)": "<rootDir>/src/services/$1",
        },
        transform: {
            ".(ts)": "ts-jest",
        },
        testTimeout: 90000,
    };
};