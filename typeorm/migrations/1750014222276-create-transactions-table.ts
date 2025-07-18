import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateTransactionsTable1750014222276
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE TYPE "public"."transactions_type_enum" AS ENUM ('INCOME', 'EXPENSE')
            `);

    await queryRunner.createTable(
      new Table({
        name: "transactions",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "name",
            type: "varchar",
            length: "255"
          },
          {
            name: "description",
            type: "varchar",
            length: "255"
          },
          {
            name: "type",
            type: "enum",
            enum: ["INCOME", "EXPENSE"]
          },
          {
            name: "origin_id",
            type: "int",
            unsigned: true
          },
          {
            name: "amount",
            type: "decimal",
            precision: 10,
            scale: 2
          },
          {
            name: "start_date",
            type: "date"
          },
          {
            name: "is_recurring",
            type: "boolean",
            default: false
          },
          {
            name: "end_date",
            type: "date",
            isNullable: true
          },
          {
            name: "user_id",
            type: "int"
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
      "transactions",
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
      "transactions",
      new TableIndex({
        name: "IDX_transactions_user",
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

    await queryRunner.createIndex(
      "transactions",
      new TableIndex({
        name: "IDX_transactions_type",
        columnNames: ["type"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("transactions");

    if (!table) throw new Error("Table transactions not found");

    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("user_id") !== -1
    );

    if (!userForeignKey) throw new Error("Foreign key user_id not found");

    const originForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("origin_id") !== -1
    );

    if (!originForeignKey) throw new Error("Foreign key origin_id not found");

    await queryRunner.dropIndex("transactions", "IDX_transactions_type");
    await queryRunner.dropIndex("transactions", "IDX_transactions_user");
    await queryRunner.dropIndex("transactions", "IDX_transactions_origin");
    await queryRunner.dropForeignKey("transactions", userForeignKey);
    await queryRunner.dropForeignKey("transactions", originForeignKey);
    await queryRunner.dropTable("transactions");

    await queryRunner.query(`
                DROP TYPE "public"."transactions_type_enum";
            `);
  }
}
