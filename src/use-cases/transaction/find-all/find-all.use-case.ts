import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import { Transaction } from "@domain/entities/transaction.entity";
import {
  TransactionRepository,
  TransactionFindAllToUseCase
} from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";

@Injectable()
export class FindAllTransactionUseCase {
  constructor(
    private readonly transactionsRepository: TransactionRepository,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    userId: number,
    queryParams: TransactionFindAllToUseCase
  ): Promise<PaginatedResult<Transaction> | void> {
    const { page, limit, sortBy, sortOrder, ...filters } = queryParams;

    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const allTransactions = await this.transactionsRepository.findAll(userId, {
      ...repositoryParams,
      sortBy,
      sortOrder,
      ...filters
    });

    const { data: transactions, total } = allTransactions;

    return createPaginationResult(transactions, paginationParams, total);
  }
}
