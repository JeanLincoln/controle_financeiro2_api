import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { CryptographyModule } from "../cryptography";
import { AuthModule } from "../auth";
import { JwtModule } from "@nestjs/jwt";

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
      synchronize: process.env.ENV === "DEV",
      entities: [__dirname, "dist/src/domain/entities/*{.ts,.js}"]
    }),
    DatabaseModule,
    CryptographyModule,
    ExceptionsModule,
    JwtModule,
    AuthModule,
    UserModule
  ]
})
export class AppModule {}
