import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class MakeTransactionDescriptionNullable1788996243321
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "transactions",
      "description",
      new TableColumn({
        name: "description",
        type: "varchar",
        length: "255",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "transactions",
      "description",
      new TableColumn({
        name: "description",
        type: "varchar",
        length: "255",
        isNullable: false
      })
    );
  }
}
