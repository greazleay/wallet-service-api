import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactoredAccountTransactionRelation1665432855296 implements MigrationInterface {
    name = 'RefactoredAccountTransactionRelation1665432855296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_3230f4b643eb2072ca122404c87\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_b21f527b81ddae617241c98675f\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`debitAccountId\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`creditAccountId\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`accountId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_3d6e89b14baa44a71870450d14d\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_3d6e89b14baa44a71870450d14d\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`accountId\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`creditAccountId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`debitAccountId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_b21f527b81ddae617241c98675f\` FOREIGN KEY (\`creditAccountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_3230f4b643eb2072ca122404c87\` FOREIGN KEY (\`debitAccountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
