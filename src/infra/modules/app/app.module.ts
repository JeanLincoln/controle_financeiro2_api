import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { DatabaseModule } from "../database/database.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthModule } from "../auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { CategoryModule } from "../category/category.module";
import { SubCategoryModule } from "../sub-category/sub-category.module";
import { OriginModule } from "../origin/origin.module";
import { TransactionModule } from "../transaction/transaction.module";
import { DashboardModule } from "../dashboard/dashboard.module";

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
