import { MigrationInterface, QueryRunner } from "typeorm";

export class LocalDBSetup1669802743179 implements MigrationInterface {
    name = 'LocalDBSetup1669802743179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`version\` int NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`fullName\` varchar(255) NOT NULL, \`lastLogin\` datetime NULL, \`roles\` set ('502a3a34-4c0c-434b-a5fd-6ffaee40a4a9', 'f3320a74-64c7-4c52-ac05-7866de5d1d54', '6d75c43e-43e7-48e2-8d20-58d25f7a9e3a') NOT NULL DEFAULT '6d75c43e-43e7-48e2-8d20-58d25f7a9e3a', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transaction\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`version\` int NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`transactionAmount\` decimal(15,2) NOT NULL DEFAULT '0.00', \`transactionType\` enum ('FUNDS TRANSFER', 'FUNDS DEPOSIT', 'FUNDS WITHDRAWAL') NOT NULL DEFAULT 'FUNDS DEPOSIT', \`transactionMode\` enum ('DEBIT', 'CREDIT') NOT NULL DEFAULT 'DEBIT', \`transactionStatus\` enum ('FAILED', 'SUCCESSFUL') NOT NULL DEFAULT 'SUCCESSFUL', \`walletBalance\` decimal(15,2) NOT NULL DEFAULT '0.00', \`transactionRef\` varchar(255) NULL, \`walletId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`wallet\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`version\` int NOT NULL, \`walletName\` varchar(255) NOT NULL, \`walletNumber\` int NOT NULL, \`walletBalance\` decimal(15,2) NOT NULL DEFAULT '0.00', \`walletHolderId\` varchar(36) NULL, UNIQUE INDEX \`IDX_154f4b079f741fb301897739da\` (\`walletNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reset_token\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`version\` int NOT NULL, \`email\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`expiry\` datetime NOT NULL, UNIQUE INDEX \`IDX_0f7955540e5d25c66dc00dad27\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_900eb6b5efaecf57343e4c0e79d\` FOREIGN KEY (\`walletId\`) REFERENCES \`wallet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wallet\` ADD CONSTRAINT \`FK_a4425f0a172341ab6f91c57782b\` FOREIGN KEY (\`walletHolderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wallet\` DROP FOREIGN KEY \`FK_a4425f0a172341ab6f91c57782b\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_900eb6b5efaecf57343e4c0e79d\``);
        await queryRunner.query(`DROP INDEX \`IDX_0f7955540e5d25c66dc00dad27\` ON \`reset_token\``);
        await queryRunner.query(`DROP TABLE \`reset_token\``);
        await queryRunner.query(`DROP INDEX \`IDX_154f4b079f741fb301897739da\` ON \`wallet\``);
        await queryRunner.query(`DROP TABLE \`wallet\``);
        await queryRunner.query(`DROP TABLE \`transaction\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
