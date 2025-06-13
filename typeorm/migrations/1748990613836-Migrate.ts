import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class Migrate1748990613836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."category_type_enum" AS ENUM ('INCOME', 'EXPENSE')
        `);

    await queryRunner.createTable(
      new Table({
        name: "categories",
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
            name: "type",
            type: "enum",
            enum: ["INCOME", "EXPENSE"]
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
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "user_id",
            type: "int",
            unsigned: true
          }
        ]
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "sub_categories",
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
            default: "CURRENT_TIMESTAMP"
          }
        ]
      })
    );

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
      "sub_categories",
      new TableForeignKey({
        columnNames: ["category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "categories",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "categories",
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
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE"
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
      "categories",
      new TableIndex({
        name: "IDX_categories_type",
        columnNames: ["type"]
      })
    );

    await queryRunner.createIndex(
      "categories",
      new TableIndex({
        name: "IDX_categories_user",
        columnNames: ["user_id"]
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
        name: "IDX_transactions_start_date",
        columnNames: ["start_date"]
      })
    );

    await queryRunner.createIndex(
      "sub_categories",
      new TableIndex({
        name: "IDX_sub_categories_category",
        columnNames: ["category_id"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("categories", "IDX_categories_type");
    await queryRunner.dropIndex("categories", "IDX_categories_user");
    await queryRunner.dropIndex("transactions", "IDX_transactions_user");
    await queryRunner.dropIndex("transactions", "IDX_transactions_start_date");
    await queryRunner.dropIndex(
      "sub_categories",
      "IDX_sub_categories_category"
    );

    await queryRunner.dropTable("transactions_sub_categories");
    await queryRunner.dropTable("transactions_categories");
    await queryRunner.dropTable("transactions");
    await queryRunner.dropTable("sub_categories");
    await queryRunner.dropTable("categories");

    await queryRunner.query(`
            DROP TYPE "public"."category_type_enum";
        `);
  }
}
