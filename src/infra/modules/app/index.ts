import { HelloWorldController } from "@infra/controllers/hello-world";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [HelloWorldController],
  providers: []
})
export class AppModule {}
