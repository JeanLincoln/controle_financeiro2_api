import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { UserModule } from "../user/user.module";
import { CreateTransactionUseCase } from "@use-cases/transaction/create/create.use-case";
import { TransactionController } from "@infra/controllers/transaction/transaction.controller";
import { CategoryModule } from "../category/category.module";
import { SubCategoryModule } from "../sub-category/sub-category.module";
import { OriginModule } from "../origin/origin.module";
import { FindAndValidateFromParamTransactionUseCase } from "@use-cases/transaction/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { FindAllTransactionUseCase } from "@use-cases/transaction/find-all/find-all.use-case";
import { UpdateTransactionUseCase } from "@use-cases/transaction/update/update.use-case";
import { DeleteTransactionUseCase } from "@use-cases/transaction/delete/delete.use-case";
import { PaginationModule } from "../pagination/pagination.module";

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ExceptionsModule,
    UserModule,
    CategoryModule,
    SubCategoryModule,
    OriginModule,
    PaginationModule
  ],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    FindAndValidateFromParamTransactionUseCase,
    FindAllTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase
  ],
  exports: [FindAndValidateFromParamTransactionUseCase]
})
export class TransactionModule {}
