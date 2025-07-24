import { TransactionType } from "@domain/entities/transaction.entity";
import {
  TransactionRepository,
  TransactionRanking
} from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionRankingUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(
    userId: number,
    type?: TransactionType
  ): Promise<TransactionRanking> {
    return this.transactionRepository.getCurrentMonthTopFiveTransactions(
      userId,
      type
    );
  }
}
