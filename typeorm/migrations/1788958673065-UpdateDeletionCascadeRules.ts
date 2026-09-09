import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class UpdateDeletionCascadeRules1788958673065
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("transactions");

    if (!table) throw new Error("Table transactions not found");

    const originForeignKey = table.foreignKeys.find((foreignKey) =>
      foreignKey.columnNames.includes("origin_id")
    );

    if (!originForeignKey) {
      throw new Error("Foreign key origin_id not found");
    }

    await queryRunner.dropForeignKey("transactions", originForeignKey);
    await queryRunner.createForeignKey(
      "transactions",
      new TableForeignKey({
        columnNames: ["origin_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "origins",
        onDelete: "NO ACTION"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("transactions");

    if (!table) throw new Error("Table transactions not found");

    const originForeignKey = table.foreignKeys.find((foreignKey) =>
      foreignKey.columnNames.includes("origin_id")
    );

    if (!originForeignKey) {
      throw new Error("Foreign key origin_id not found");
    }

    await queryRunner.dropForeignKey("transactions", originForeignKey);
    await queryRunner.createForeignKey(
      "transactions",
      new TableForeignKey({
        columnNames: ["origin_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "origins",
        onDelete: "CASCADE"
      })
    );
  }
}
