import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";
import { CategoryAuthenticatedRequest } from "@use-cases/category/find-and-validate-from-param/find-and-validate-from-param.use-case";

@Injectable()
export class FindAllSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    request: CategoryAuthenticatedRequest
  ): Promise<SubCategory[] | void> {
    const { params } = request;
    const categoryId = Number(params.categoryId);

    const subCategories =
      await this.subCategoryRepository.findAllByCategory(categoryId);

    if (!subCategories) {
      return this.exceptionAdapter.notFound({
        message: "Something went wrong while fetching sub-categories"
      });
    }

    return subCategories;
  }
}
