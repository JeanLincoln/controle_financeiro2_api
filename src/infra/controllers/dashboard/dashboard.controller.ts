import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ApiCookieAuth } from "@nestjs/swagger";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { BalanceUseCase } from "@use-cases/dashboard/balance/balance.use-case";
import { CategoryRankingUseCase } from "@use-cases/dashboard/category-ranking/category-ranking.use-case";
import { SubCategoryRankingUseCase } from "@use-cases/dashboard/sub-category-ranking/sub-category-ranking.use-case";
import { SubCategoryRankingQueryDto } from "./dto/sub-category-ranking.dto";
import { CategoryRankingQueryDto } from "./dto/category-ranking.dto";
import { TransactionRankingQueryDto } from "./dto/transaction-ranking.dto";
import { TransactionRankingUseCase } from "@use-cases/dashboard/transaction-ranking/transaction-ranking.use-case";
import { OriginRankingUseCase } from "@use-cases/dashboard/origin-ranking/origin-ranking.use-case";
import { OriginRankingQueryDto } from "./dto/origin-ranking.dto";
import { TransactionGraphUseCase } from "@use-cases/dashboard/transaction-graph/transaction-graph.use-case";
import { TransactionGraphQueryDto } from "./dto/transaction-graph.dto";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(
    private readonly balanceUseCase: BalanceUseCase,
    private readonly categoryRankingUseCase: CategoryRankingUseCase,
    private readonly subCategoryRankingUseCase: SubCategoryRankingUseCase,
    private readonly transactionRankingUseCase: TransactionRankingUseCase,
    private readonly originRankingUseCase: OriginRankingUseCase,
    private readonly transactionGraphUseCase: TransactionGraphUseCase
  ) {}

  @Get("balance")
  async getBalance(@Req() req: AuthenticatedRequest) {
    return this.balanceUseCase.execute(req.user.id);
  }

  @Get("category-ranking")
  async getCategoryRanking(
    @Req() req: AuthenticatedRequest,
    @Query() { type }: CategoryRankingQueryDto
  ) {
    return this.categoryRankingUseCase.execute(req.user.id, type);
  }

  @Get("sub-category-ranking")
  async getSubCategoryRanking(
    @Req() req: AuthenticatedRequest,
    @Query() { type }: SubCategoryRankingQueryDto
  ) {
    return this.subCategoryRankingUseCase.execute(req.user.id, type);
  }

  @Get("transaction-ranking")
  async getTransactionRanking(
    @Req() req: AuthenticatedRequest,
    @Query() { type }: TransactionRankingQueryDto
  ) {
    return this.transactionRankingUseCase.execute(req.user.id, type);
  }

  @Get("origin-ranking")
  async getOriginRanking(
    @Req() req: AuthenticatedRequest,
    @Query() { type }: OriginRankingQueryDto
  ) {
    return this.originRankingUseCase.execute(req.user.id, type);
  }

  @Get("transaction-graph")
  async getTransactionGraph(
    @Req() req: AuthenticatedRequest,
    @Query() { startDate, endDate, type }: TransactionGraphQueryDto
  ) {
    return this.transactionGraphUseCase.execute(req.user.id, {
      startDate,
      endDate,
      type
    });
  }
}
