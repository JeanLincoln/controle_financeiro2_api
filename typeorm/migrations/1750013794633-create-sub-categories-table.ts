import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateSubCategoriesTable1750013794633
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
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

    await queryRunner.createForeignKey(
      "sub_categories",
      new TableForeignKey({
        columnNames: ["category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "categories",
        onDelete: "CASCADE"
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
    const table = await queryRunner.getTable("sub_categories");

    if (!table) throw new Error("Table sub_categories not found");

    const categoryForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("category_id") !== -1
    );

    if (!categoryForeignKey)
      throw new Error("Foreign key category_id not found");

    await queryRunner.dropIndex(
      "sub_categories",
      "IDX_sub_categories_category"
    );
    await queryRunner.dropForeignKey("sub_categories", categoryForeignKey);
    await queryRunner.dropTable("sub_categories");
  }
}
