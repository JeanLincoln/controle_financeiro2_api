import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class Migrate1748991345795 implements MigrationInterface {
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

    await queryRunner.createForeignKey(
      "transactions",
      new TableForeignKey({
        columnNames: ["origin_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "origins",
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

    await queryRunner.createIndex(
      "transactions",
      new TableIndex({
        name: "IDX_transactions_origin",
        columnNames: ["origin_id"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("origins", "IDX_origins_user");
    await queryRunner.dropIndex("transactions", "IDX_transactions_origin");
    await queryRunner.dropTable("origins");
  }
}
