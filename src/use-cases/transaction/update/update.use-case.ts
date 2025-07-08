import { Category } from "@domain/entities/category.entity";
import { Origin } from "@domain/entities/origin.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { Transaction } from "@domain/entities/transaction.entity";
import {
  CreateOrUpdateAllTransactionProps,
  TransactionRepository
} from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateTransactionUseCase {
  constructor(private readonly transactionsRepository: TransactionRepository) {}

  async execute(
    transactionToUpdate: Transaction,
    userId: number,
    origin: Origin,
    categories: Category[],
    subCategories: SubCategory[],
    updateData: CreateOrUpdateAllTransactionProps
  ): Promise<void> {
    await this.transactionsRepository.update(
      transactionToUpdate,
      userId,
      origin,
      categories,
      subCategories,
      updateData
    );
  }
}
