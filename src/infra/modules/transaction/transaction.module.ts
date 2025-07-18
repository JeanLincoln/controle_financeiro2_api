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
import { FindAllTransactionUseCase } from "@use-cases/transaction/find-all/find-all.use-case";
import { UpdateTransactionUseCase } from "@use-cases/transaction/update/update.use-case";
import { DeleteTransactionUseCase } from "@use-cases/transaction/delete/delete.use-case";
import { PaginationModule } from "../pagination/pagination.module";
import { FindAndValidateTransactionUseCase } from "@use-cases/transaction/find-and-validate/find-and-validate.use-case";

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
    FindAndValidateTransactionUseCase,
    FindAllTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase
  ],
  exports: [FindAndValidateTransactionUseCase]
})
export class TransactionModule {}
