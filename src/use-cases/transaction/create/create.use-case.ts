import type { Category } from "@domain/entities/category.entity";
import type { Origin } from "@domain/entities/origin.entity";
import type { SubCategory } from "@domain/entities/sub-category.entity";
import {
  CreateOrUpdateAllTransactionProps,
  TransactionRepository
} from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(
    userId: number,
    origin: Origin,
    categories: Category[],
    subCategories: SubCategory[],
    transactionData: CreateOrUpdateAllTransactionProps
  ): Promise<void> {
    await this.transactionRepository.create(
      userId,
      origin,
      categories,
      subCategories,
      transactionData
    );
  }
}
