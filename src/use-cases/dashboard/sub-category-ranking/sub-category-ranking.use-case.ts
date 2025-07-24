import { TransactionType } from "@domain/entities/transaction.entity";
import {
  SubCategoryRepository,
  SubCategoryRanking
} from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SubCategoryRankingUseCase {
  constructor(private readonly subCategoryRepository: SubCategoryRepository) {}

  async execute(
    userId: number,
    type?: TransactionType
  ): Promise<SubCategoryRanking> {
    return this.subCategoryRepository.getCurrentMonthTopFiveCategories(
      userId,
      type
    );
  }
}
