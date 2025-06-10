import { Injectable } from "@nestjs/common";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { SubCategory } from "@domain/entities/sub-category.entity";

@Injectable()
export class FindSubCategoryByIdUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(
    userId: number,
    subCategoryId: number
  ): Promise<SubCategory | void> {
    const subCategory =
      await this.subCategoryRepository.findById(subCategoryId);

    if (!subCategory) {
      return this.exceptionAdapter.notFound({
        message: "Sub-category not found"
      });
    }

    const category = await this.categoryRepository.findById(
      subCategory.categoryId
    );

    if (!category) {
      return this.exceptionAdapter.notFound({
        message: "Category not found"
      });
    }

    if (category.userId !== userId) {
      return this.exceptionAdapter.forbidden({
        message: "You are not allowed to access this sub-category"
      });
    }

    return subCategory;
  }
}
