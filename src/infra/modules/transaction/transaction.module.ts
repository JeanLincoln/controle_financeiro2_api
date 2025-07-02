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

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ExceptionsModule,
    UserModule,
    CategoryModule,
    SubCategoryModule,
    OriginModule
  ],
  controllers: [TransactionController],
  providers: [CreateTransactionUseCase]
})
export class TransactionModule {}
