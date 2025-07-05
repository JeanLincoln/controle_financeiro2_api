import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { Transaction } from "@domain/entities/transaction.entity";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllTransactionUseCase {
  constructor(
    private readonly transactionsRepository: TransactionRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(userId: number): Promise<Transaction[] | void> {
    const allTransactions = await this.transactionsRepository.findAll(userId);

    if (!allTransactions) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while trying to find all transactions."
      });
      return;
    }

    const arrayIsEmpty = allTransactions.length === 0;

    return arrayIsEmpty ? [] : allTransactions;
  }
}
