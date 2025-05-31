import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { CreateUserUseCase } from "@use-cases/user/create";
import { FindByEmailUserUseCase } from "@use-cases/user/find-by-email";
import { FindByIdUserUseCase } from "@use-cases/user/find-by-id";
import { UpdateUserUseCase } from "@use-cases/user/update";
import { DeleteUserUseCase } from "@use-cases/user/delete";
import { FindAllUserUseCase } from "@use-cases/user/find-all";
import { ExceptionsModule } from "../exceptions";
import { CryptographyModule } from "../cryptography";

@Module({
  imports: [DatabaseModule, ExceptionsModule, CryptographyModule],
  providers: [
    CreateUserUseCase,
    FindByEmailUserUseCase,
    FindByIdUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindAllUserUseCase
  ],
  exports: [
    CreateUserUseCase,
    FindByEmailUserUseCase,
    FindByIdUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindAllUserUseCase
  ]
})
export class UserModule {}
