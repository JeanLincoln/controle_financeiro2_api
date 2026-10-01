import * as dotenv from "dotenv";
import { readFileSync } from "node:fs";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: {
    ca: readFileSync(
      "/etc/controle-financeiro-api/rds-global-bundle.pem",
      "utf8"
    ),
    rejectUnauthorized: true
  },
  entities: ["./src/domain/entities/*.entity.ts"],
  migrations: ["./typeorm/migrations/*.ts"],
  seeds: ["./typeorm/seed/*.seed.ts"],
  synchronize: false
};

export const AppDataSource = new DataSource(options);
