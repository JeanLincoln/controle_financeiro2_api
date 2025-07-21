import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BalanceUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(userId: number) {
    return this.transactionRepository.getCurrentBalance(userId);
  }
}
