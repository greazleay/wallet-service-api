import { MigrationInterface, QueryRunner } from "typeorm";

export class SplitTransactionsToCreditAndDebitOnAccountEntity1665077139966 implements MigrationInterface {
    name = 'SplitTransactionsToCreditAndDebitOnAccountEntity1665077139966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_1d251b00f7fc5ea00cb48623dbd\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_ac8efff1e2135ddfd0ab1796c5a\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`fromAccountId\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`toAccountId\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`debitAccountId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`creditAccountId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_3230f4b643eb2072ca122404c87\` FOREIGN KEY (\`debitAccountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_b21f527b81ddae617241c98675f\` FOREIGN KEY (\`creditAccountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_b21f527b81ddae617241c98675f\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_3230f4b643eb2072ca122404c87\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`creditAccountId\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`debitAccountId\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`toAccountId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`fromAccountId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_ac8efff1e2135ddfd0ab1796c5a\` FOREIGN KEY (\`toAccountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_1d251b00f7fc5ea00cb48623dbd\` FOREIGN KEY (\`fromAccountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
