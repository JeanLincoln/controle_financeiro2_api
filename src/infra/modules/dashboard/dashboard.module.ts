import { Module } from "@nestjs/common";
import { BalanceUseCase } from "@use-cases/dashboard/balance/balance.use-case";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { DashboardController } from "@infra/controllers/dashboard/dashboard.controller";
import { CategoryRankingUseCase } from "@use-cases/dashboard/category-ranking/category-ranking.use-case";
import { SubCategoryRankingUseCase } from "@use-cases/dashboard/sub-category-ranking/sub-category-ranking.use-case";
import { TransactionRankingUseCase } from "@use-cases/dashboard/transaction-ranking/transaction-ranking.use-case";

@Module({
  imports: [DatabaseModule, AuthModule, ExceptionsModule],
  controllers: [DashboardController],
  providers: [
    BalanceUseCase,
    CategoryRankingUseCase,
    SubCategoryRankingUseCase,
    TransactionRankingUseCase
  ]
})
export class DashboardModule {}
