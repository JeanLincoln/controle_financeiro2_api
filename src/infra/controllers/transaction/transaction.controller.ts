import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { ApiCookieAuth } from "@nestjs/swagger";
import { CreateTransactionUseCase } from "@use-cases/transaction/create/create.use-case";
import { CreateTransactionDto } from "./dto/create.dto";
import { FindTransactionByIdParamDto } from "./dto/find-by-id.dto";
import { FindAllTransactionUseCase } from "@use-cases/transaction/find-all/find-all.use-case";
import { UpdateTransactionUseCase } from "@use-cases/transaction/update/update.use-case";
import {
  UpdateTransactionBodyDto,
  UpdateTransactionParamDto
} from "./dto/update.dto";
import { DeleteTransactionUseCase } from "@use-cases/transaction/delete/delete.use-case";
import { DeleteTransactionParamDto } from "./dto/delete.dto";
import { Transaction } from "@domain/entities/transaction.entity";
import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import { FindAllTransactionsQueryParamDto } from "./dto/find-all.dto";
import {
  BodyCategoriesAuthenticatedRequest,
  QueryCategoryAuthenticatedRequest
} from "@use-cases/category/find-and-validate/find-and-validate.use-case";
import { CategoryValidationGuard } from "@infra/commons/guards/category/category-validation.guard";
import { OriginValidationGuard } from "@infra/commons/guards/origin/origin-validation.guard";
import {
  BodyOriginAuthenticatedRequest,
  QueryOriginAuthenticatedRequest
} from "@use-cases/origin/find-and-validate/find-and-validate.use-case";
import { SubCategoryValidationGuard } from "@infra/commons/guards/sub-category/sub-category-validation.guard";
import {
  BodySubCategoriesAuthenticatedRequest,
  QuerySubCategoryAuthenticatedRequest
} from "@use-cases/sub-category/find-and-validate/find-and-validate.use-case";
import { TransactionValidationGuard } from "@infra/commons/guards/transaction/transaction-param-validation.guard";
import { ParamTransactionAuthenticatedRequest } from "@use-cases/transaction/find-and-validate/find-and-validate.use-case";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("transaction")
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly findAllTransactionUseCase: FindAllTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase
  ) {}

  @UseGuards(
    CategoryValidationGuard,
    SubCategoryValidationGuard,
    OriginValidationGuard
  )
  @Post()
  async create(
    @Req()
    req: BodyOriginAuthenticatedRequest &
      BodySubCategoriesAuthenticatedRequest &
      BodyCategoriesAuthenticatedRequest,
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

  @Get()
  @UseGuards(
    CategoryValidationGuard,
    OriginValidationGuard,
    SubCategoryValidationGuard
  )
  async findAll(
    @Req()
    req: QueryOriginAuthenticatedRequest &
      QueryCategoryAuthenticatedRequest &
      QuerySubCategoryAuthenticatedRequest,
    @Query()
    queryParams: FindAllTransactionsQueryParamDto
  ): Promise<PaginatedResult<Transaction> | void> {
    return this.findAllTransactionUseCase.execute(req.user.id, queryParams);
  }

  @UseGuards(TransactionValidationGuard)
  @Get(":transactionId")
  async findById(
    @Req() req: ParamTransactionAuthenticatedRequest,
    @Param() _: FindTransactionByIdParamDto
  ) {
    return req.transaction;
  }

  @UseGuards(
    TransactionValidationGuard,
    CategoryValidationGuard,
    SubCategoryValidationGuard,
    OriginValidationGuard
  )
  @Put(":transactionId")
  async update(
    @Req()
    req: ParamTransactionAuthenticatedRequest &
      BodyOriginAuthenticatedRequest &
      BodySubCategoriesAuthenticatedRequest &
      BodyCategoriesAuthenticatedRequest,
    @Param() _: UpdateTransactionParamDto,
    @Body() transactionData: UpdateTransactionBodyDto
  ) {
    return this.updateTransactionUseCase.execute(
      req.transaction,
      req.user.id,
      req.origin,
      req.categories,
      req.subCategories,
      transactionData
    );
  }

  @UseGuards(TransactionValidationGuard)
  @HttpCode(204)
  @Delete(":transactionId")
  async delete(
    @Req() req: ParamTransactionAuthenticatedRequest,
    @Param() _: DeleteTransactionParamDto
  ) {
    return this.deleteTransactionUseCase.execute(req.transaction);
  }
}
