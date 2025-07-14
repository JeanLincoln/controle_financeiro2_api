import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1748257824862 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "first_name",
            type: "varchar",
            length: "255"
          },
          {
            name: "last_name",
            type: "varchar",
            length: "255"
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true
          },
          {
            name: "password",
            type: "varchar",
            length: "255"
          },
          {
            name: "birth_date",
            type: "date",
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
            isNullable: true,
            default: null
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
