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
import { OriginBodyGuard } from "@infra/commons/guards/origin/origin-body-validation.guard";
import { CategoriesBodyGuard } from "@infra/commons/guards/category/categories-body-validation.guard";
import { SubCategoriesBodyGuard } from "@infra/commons/guards/sub-category/sub-categories-body-validation.guard";
import { OriginBodyAuthenticatedRequest } from "@use-cases/origin/find-and-validate-from-body/find-and-validate-from-body.use-case";
import { ManySubCategoriesAuthenticatedRequest } from "@use-cases/sub-category/find-and-validate-many-from-body/find-and-validate-many-from-body.use-case";
import { ManyCategoriesAuthenticatedRequest } from "@use-cases/category/find-and-validate-many-from-body/find-and-validate-many-from-body.use-case";
import { TransactionAuthenticatedRequest } from "@use-cases/transaction/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { FindTransactionByIdParamDto } from "./dto/find-by-id.dto";
import { TransactionParamGuard } from "@infra/commons/guards/transaction/transaction-param-validation.guard";
import { FindAllTransactionUseCase } from "@use-cases/transaction/find-all/find-all.use-case";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { UpdateTransactionUseCase } from "@use-cases/transaction/update/update.use-case";
import {
  UpdateTransactionBodyDto,
  UpdateTransactionParamDto
} from "./dto/update.dto";
import { DeleteTransactionUseCase } from "@use-cases/transaction/delete/delete.use-case";
import { DeleteTransactionParamDto } from "./dto/delete.dto";
import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { Transaction } from "@domain/entities/transaction.entity";
import { PaginatedResult } from "@domain/entities/pagination.entity";

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

  @UseGuards(TransactionParamGuard)
  @Get(":transactionId")
  async findById(
    @Req() req: TransactionAuthenticatedRequest,
    @Param() _: FindTransactionByIdParamDto
  ) {
    return req.transaction;
  }

  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() { page, limit }: PaginationQueryDto
  ): Promise<PaginatedResult<Transaction> | void> {
    return this.findAllTransactionUseCase.execute(req.user.id, page, limit);
  }

  @UseGuards(
    TransactionParamGuard,
    CategoriesBodyGuard,
    SubCategoriesBodyGuard,
    OriginBodyGuard
  )
  @Put(":transactionId")
  async update(
    @Req()
    req: TransactionAuthenticatedRequest &
      OriginBodyAuthenticatedRequest &
      ManySubCategoriesAuthenticatedRequest &
      ManyCategoriesAuthenticatedRequest,
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

  @UseGuards(TransactionParamGuard)
  @HttpCode(204)
  @Delete(":transactionId")
  async delete(
    @Req() req: TransactionAuthenticatedRequest,
    @Param() _: DeleteTransactionParamDto
  ) {
    return this.deleteTransactionUseCase.execute(req.transaction);
  }
}
