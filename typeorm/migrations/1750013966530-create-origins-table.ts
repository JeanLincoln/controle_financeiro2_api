import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateOriginsTable1750013966530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "origins",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            unsigned: true,
            generationStrategy: "increment"
          },
          {
            name: "name",
            type: "varchar",
            length: "100"
          },
          {
            name: "description",
            type: "text",
            isNullable: true
          },
          {
            name: "color",
            type: "varchar",
            length: "7",
            isNullable: true
          },
          {
            name: "icon",
            type: "varchar",
            length: "255",
            isNullable: true
          },
          {
            name: "user_id",
            type: "int",
            unsigned: true
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "origins",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createIndex(
      "origins",
      new TableIndex({
        name: "IDX_origins_user",
        columnNames: ["user_id"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("origins");

    if (!table) throw new Error("Table origins not found");

    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("user_id") !== -1
    );

    if (!userForeignKey) throw new Error("Foreign key user_id not found");

    await queryRunner.dropIndex("origins", "IDX_origins_user");
    await queryRunner.dropForeignKey("origins", userForeignKey);
    await queryRunner.dropTable("origins");
  }
}
