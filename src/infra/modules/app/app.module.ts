import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { readFileSync } from "node:fs";
import { AuthModule } from "../auth/auth.module";
import { CategoryModule } from "../category/category.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DashboardModule } from "../dashboard/dashboard.module";
import { DatabaseModule } from "../database/database.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { OriginModule } from "../origin/origin.module";
import { SubCategoryModule } from "../sub-category/sub-category.module";
import { TransactionModule } from "../transaction/transaction.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
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
      synchronize: false,
      entities: [__dirname, "dist/src/domain/entities/*{.ts,.js}"]
    }),
    DatabaseModule,
    CryptographyModule,
    ExceptionsModule,
    JwtModule,
    AuthModule,
    UserModule,
    CategoryModule,
    SubCategoryModule,
    OriginModule,
    TransactionModule,
    DashboardModule
  ]
})
export class AppModule {}
