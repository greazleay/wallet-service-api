import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedTransactionDateFromTransactionEntity1665417664603 implements MigrationInterface {
    name = 'RemovedTransactionDateFromTransactionEntity1665417664603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`transactionDate\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`transactionDate\` datetime NOT NULL`);
    }

}
