import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResetTokenEntity1666883897606 implements MigrationInterface {
    name = 'AddResetTokenEntity1666883897606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reset_token\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`version\` int NOT NULL, \`email\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`expiry\` datetime NOT NULL, UNIQUE INDEX \`IDX_0f7955540e5d25c66dc00dad27\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0f7955540e5d25c66dc00dad27\` ON \`reset_token\``);
        await queryRunner.query(`DROP TABLE \`reset_token\``);
    }

}
