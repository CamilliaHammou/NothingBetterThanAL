import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1713125458471 implements MigrationInterface {
    name = 'Default1713125458471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`currency\` varchar(255) NOT NULL DEFAULT 'EUR'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`currency\` varchar(255) NOT NULL DEFAULT 'EUR'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`currency\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`currency\``);
    }

}
