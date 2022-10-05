import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserTransactionRelation1664999024987 implements MigrationInterface {
    name = 'RemoveUserTransactionRelation1664999024987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_16ead8467f1f71ac7232aa46ad3\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`customerId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`customerId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_16ead8467f1f71ac7232aa46ad3\` FOREIGN KEY (\`customerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
