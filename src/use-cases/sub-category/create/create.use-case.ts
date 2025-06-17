import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CategoryRepository } from "@domain/repositories/category.repository";
import {
  CreateOrUpdateAllSubCategoryProps,
  SubCategoryRepository
} from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(
    userId: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ) {
    const category = await this.categoryRepository.findById(
      subCategory.categoryId
    );

    if (!category) {
      this.exceptionAdapter.notFound({ message: "Category not found" });
      return;
    }

    const notCategoriesOwner = category.user.id !== userId;

    if (notCategoriesOwner) {
      this.exceptionAdapter.forbidden({
        message: "You are not the owner of this category"
      });
      return;
    }

    await this.subCategoryRepository.create(
      subCategory.categoryId,
      subCategory
    );
  }
}
