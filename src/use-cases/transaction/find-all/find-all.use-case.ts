import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { PaginatedResult } from "@domain/entities/pagination.entity";
import { Transaction } from "@domain/entities/transaction.entity";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/pagination/pagination.use-case";

@Injectable()
export class FindAllTransactionUseCase {
  constructor(
    private readonly transactionsRepository: TransactionRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    userId: number,
    page?: number,
    limit?: number
  ): Promise<PaginatedResult<Transaction> | void> {
    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const allTransactions = await this.transactionsRepository.findAll(
      userId,
      repositoryParams
    );

    const { data: transactions, total } = allTransactions;

    return createPaginationResult(transactions, paginationParams, total);
  }
}
