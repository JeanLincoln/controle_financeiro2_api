import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateTransactionsSubCategoriesTable1750014431946
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transactions_sub_categories",
        columns: [
          {
            name: "transaction_id",
            type: "int"
          },
          {
            name: "sub_category_id",
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
      "transactions_sub_categories",
      new TableForeignKey({
        columnNames: ["transaction_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "transactions",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "transactions_sub_categories",
      new TableForeignKey({
        columnNames: ["sub_category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "sub_categories",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createIndex(
      "transactions_sub_categories",
      new TableIndex({
        name: "IDX_transactions_sub_categories_transaction",
        columnNames: ["transaction_id"]
      })
    );

    await queryRunner.createIndex(
      "transactions_sub_categories",
      new TableIndex({
        name: "IDX_transactions_sub_categories_sub_category",
        columnNames: ["sub_category_id"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("transactions_sub_categories");

    if (!table) throw new Error("Table transactions_sub_categories not found");

    const subCategoryForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("sub_category_id") !== -1
    );

    if (!subCategoryForeignKey)
      throw new Error("Foreign key sub_category_id not found");

    const transactionForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("transaction_id") !== -1
    );

    if (!transactionForeignKey)
      throw new Error("Foreign key transaction_id not found");

    await queryRunner.dropForeignKey(
      "transactions_sub_categories",
      subCategoryForeignKey
    );
    await queryRunner.dropForeignKey(
      "transactions_sub_categories",
      transactionForeignKey
    );
    await queryRunner.dropIndex(
      "transactions_sub_categories",
      "IDX_transactions_sub_categories_transaction"
    );
    await queryRunner.dropIndex(
      "transactions_sub_categories",
      "IDX_transactions_sub_categories_sub_category"
    );
    await queryRunner.dropTable("transactions_sub_categories");
  }
}
