import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class AddRoomMigration1711292566026 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "room",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true },
                { name: "name", type: "varchar" },
                { name: "description", type: "varchar" },
                { name: "images", type: "text" }, // Utiliser le type "text" pour stocker les images en tant que chaîne JSON
                { name: "type", type: "varchar" },
                { name: "capacity", type: "int" },
                { name: "accessibility", type: "boolean", isNullable: true },
                { name: "maintenance", type: "boolean", default: false },
                { name: "schedule", type: "json", isNullable: true }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("room");
    }
}
