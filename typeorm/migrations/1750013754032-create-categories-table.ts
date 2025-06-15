import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateCategoriesTable1750013754032 implements MigrationInterface {
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

    await queryRunner.createForeignKey(
      "categories",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "categories",
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("categories");

    if (!table) throw new Error("Table categories not found");

    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("user_id") !== -1
    );

    if (!userForeignKey) throw new Error("Foreign key user_id not found");

    await queryRunner.dropIndex("categories", "IDX_categories_type");
    await queryRunner.dropIndex("categories", "IDX_categories_user");
    await queryRunner.dropForeignKey("categories", userForeignKey);
    await queryRunner.dropTable("categories");

    await queryRunner.query(`
                DROP TYPE "public"."category_type_enum";
            `);
  }
}
