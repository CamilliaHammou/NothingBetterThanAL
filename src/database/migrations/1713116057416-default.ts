import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1713116057416 implements MigrationInterface {
    name = 'Default1713116057416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`status\` enum ('scheduled', 'completed', 'canceled') NOT NULL DEFAULT 'scheduled'`);
        await queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`room\` CHANGE \`accessibility\` \`accessibility\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_f056a463749c7b7b6700511bed7\``);
        await queryRunner.query(`ALTER TABLE \`movie\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`movie\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`movie\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`movie\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`session\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`movieId\``);
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`movieId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`ticket\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`hall_image\` ADD CONSTRAINT \`FK_18f6ec309331f334b7c6a1d65d0\` FOREIGN KEY (\`hallId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movie_image\` ADD CONSTRAINT \`FK_ee8ca996aa2471e4d23dc55b6c4\` FOREIGN KEY (\`movieId\`) REFERENCES \`movie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_f056a463749c7b7b6700511bed7\` FOREIGN KEY (\`movieId\`) REFERENCES \`movie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session_attendance\` ADD CONSTRAINT \`FK_420a67e5967491e52b82ce49dc1\` FOREIGN KEY (\`sessionId\`) REFERENCES \`session\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session_attendance\` ADD CONSTRAINT \`FK_844117c70645a33f7c2464a0fdd\` FOREIGN KEY (\`ticketId\`) REFERENCES \`ticket\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_schedule\` ADD CONSTRAINT \`FK_00fda0dea152ca01567aa51a151\` FOREIGN KEY (\`employeeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_schedule\` DROP FOREIGN KEY \`FK_00fda0dea152ca01567aa51a151\``);
        await queryRunner.query(`ALTER TABLE \`session_attendance\` DROP FOREIGN KEY \`FK_844117c70645a33f7c2464a0fdd\``);
        await queryRunner.query(`ALTER TABLE \`session_attendance\` DROP FOREIGN KEY \`FK_420a67e5967491e52b82ce49dc1\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_f056a463749c7b7b6700511bed7\``);
        await queryRunner.query(`ALTER TABLE \`movie_image\` DROP FOREIGN KEY \`FK_ee8ca996aa2471e4d23dc55b6c4\``);
        await queryRunner.query(`ALTER TABLE \`hall_image\` DROP FOREIGN KEY \`FK_18f6ec309331f334b7c6a1d65d0\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`ticket\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`movieId\``);
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`movieId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`session\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`movie\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`movie\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`movie\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`movie\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_f056a463749c7b7b6700511bed7\` FOREIGN KEY (\`movieId\`) REFERENCES \`movie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room\` CHANGE \`accessibility\` \`accessibility\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`status\``);
    }

}
