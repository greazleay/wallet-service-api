import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedAccountUserRelation1665060249829 implements MigrationInterface {
    name = 'ModifiedAccountUserRelation1665060249829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`accountHolderId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD CONSTRAINT \`FK_046d37dee2bf754ef5c6b5b767a\` FOREIGN KEY (\`accountHolderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_046d37dee2bf754ef5c6b5b767a\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`accountHolderId\``);
    }

}
