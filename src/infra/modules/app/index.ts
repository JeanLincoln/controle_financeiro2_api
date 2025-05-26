import { HelloWorldController } from "@infra/controllers/hello-world";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: process.env.ENV === "DEV",
      entities: [__dirname + "/../../../entities/*.entity.ts"]
    })
  ],
  controllers: [HelloWorldController],
  providers: []
})
export class AppModule {}
