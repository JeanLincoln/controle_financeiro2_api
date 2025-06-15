import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateTransactionsCategoriesTable1750014355131
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transactions_categories",
        columns: [
          {
            name: "transaction_id",
            type: "int"
          },
          {
            name: "category_id",
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
            default: null
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "transactions_categories",
      new TableForeignKey({
        columnNames: ["transaction_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "transactions",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "transactions_categories",
      new TableForeignKey({
        columnNames: ["category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "categories",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createIndex(
      "transactions_categories",
      new TableIndex({
        name: "IDX_transactions_categories_transaction",
        columnNames: ["transaction_id"]
      })
    );

    await queryRunner.createIndex(
      "transactions_categories",
      new TableIndex({
        name: "IDX_transactions_categories_category",
        columnNames: ["category_id"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("transactions_categories");

    if (!table) throw new Error("Table transactions_categories not found");

    const categoryForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("category_id") !== -1
    );

    if (!categoryForeignKey)
      throw new Error("Foreign key category_id not found");

    const transactionForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("transaction_id") !== -1
    );

    if (!transactionForeignKey)
      throw new Error("Foreign key transaction_id not found");

    await queryRunner.dropForeignKey(
      "transactions_categories",
      categoryForeignKey
    );
    await queryRunner.dropForeignKey(
      "transactions_categories",
      transactionForeignKey
    );
    await queryRunner.dropIndex(
      "transactions_categories",
      "IDX_transactions_categories_transaction"
    );
    await queryRunner.dropIndex(
      "transactions_categories",
      "IDX_transactions_categories_category"
    );
    await queryRunner.dropTable("transactions_categories");
  }
}
