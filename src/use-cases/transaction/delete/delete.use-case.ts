import { Transaction } from "@domain/entities/transaction.entity";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteTransactionUseCase {
  constructor(private readonly transactionsRepository: TransactionRepository) {}

  async execute(transaction: Transaction): Promise<void> {
    await this.transactionsRepository.delete(transaction);
  }
}
