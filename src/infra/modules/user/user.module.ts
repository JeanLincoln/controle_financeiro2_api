import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateUserUseCase } from "@use-cases/user/create/create.use-case";
import { FindByEmailUserUseCase } from "@use-cases/user/find-by-email/find-by-email.use-case";
import { FindByIdUserUseCase } from "@use-cases/user/find-by-id/find-by-id.use-case";
import { UpdateUserUseCase } from "@use-cases/user/update/update.use-case";
import { DeleteUserUseCase } from "@use-cases/user/delete/delete.use-case";
import { FindAllUserUseCase } from "@use-cases/user/find-all/find-all.use-case";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { UserController } from "@infra/controllers/user/user.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [DatabaseModule, ExceptionsModule, CryptographyModule, AuthModule],
  controllers: [UserController],
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
