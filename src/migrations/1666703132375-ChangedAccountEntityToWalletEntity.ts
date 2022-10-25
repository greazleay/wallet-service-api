import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedAccountEntityToWalletEntity1666703132375 implements MigrationInterface {
    name = 'ChangedAccountEntityToWalletEntity1666703132375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`roles\` set ('502a3a34-4c0c-434b-a5fd-6ffaee40a4a9', 'f3320a74-64c7-4c52-ac05-7866de5d1d54', '6d75c43e-43e7-48e2-8d20-58d25f7a9e3a') NOT NULL DEFAULT '6d75c43e-43e7-48e2-8d20-58d25f7a9e3a'`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`walletBalance\` decimal(15,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`walletId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_900eb6b5efaecf57343e4c0e79d\` FOREIGN KEY (\`walletId\`) REFERENCES \`wallet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wallet\` ADD CONSTRAINT \`FK_a4425f0a172341ab6f91c57782b\` FOREIGN KEY (\`walletHolderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wallet\` DROP FOREIGN KEY \`FK_a4425f0a172341ab6f91c57782b\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_900eb6b5efaecf57343e4c0e79d\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`walletId\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`walletBalance\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`roles\``);
    }

}
