import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { CreateUserUseCase } from "@use-cases/user/create";

@Module({
  imports: [DatabaseModule],
  providers: [CreateUserUseCase],
  exports: [CreateUserUseCase]
})
export class UserModule {}
