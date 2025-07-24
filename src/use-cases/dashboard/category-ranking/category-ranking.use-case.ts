import { TransactionType } from "@domain/entities/transaction.entity";
import {
  CategoryRepository,
  CategoryRanking
} from "@domain/repositories/category.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryRankingUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    userId: number,
    type?: TransactionType
  ): Promise<CategoryRanking> {
    return this.categoryRepository.getCurrentMonthTopFiveCategories(
      userId,
      type
    );
  }
}
