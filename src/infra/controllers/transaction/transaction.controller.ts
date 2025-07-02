import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { CreateTransactionUseCase } from "@use-cases/transaction/create/create.use-case";
import { CreateTransactionDto } from "./dto/create.dto";
import { OriginBodyGuard } from "@infra/commons/guards/origin/origin-body-validation.guard";
import { CategoriesBodyGuard } from "@infra/commons/guards/category/categories-body-validation.guard";
import { SubCategoriesBodyGuard } from "@infra/commons/guards/sub-category/sub-categories-body-validation.guard";
import type { OriginBodyAuthenticatedRequest } from "@use-cases/origin/find-and-validate-from-body/find-and-validate-from-body.use-case";
import type { ManySubCategoriesAuthenticatedRequest } from "@use-cases/sub-category/find-and-validate-many-from-body/find-and-validate-many-from-body.use-case";
import type { ManyCategoriesAuthenticatedRequest } from "@use-cases/category/find-and-validate-many-from-body/find-and-validate-many-from-body.use-case";

@UseGuards(AuthGuard)
@Controller("transaction")
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase
  ) {}

  @UseGuards(CategoriesBodyGuard, SubCategoriesBodyGuard, OriginBodyGuard)
  @Post()
  async create(
    @Req()
    req: OriginBodyAuthenticatedRequest &
      ManySubCategoriesAuthenticatedRequest &
      ManyCategoriesAuthenticatedRequest,
    @Body() TransactionData: CreateTransactionDto
  ) {
    return this.createTransactionUseCase.execute(
      req.user.id,
      req.origin,
      req.categories,
      req.subCategories,
      TransactionData
    );
  }
}
