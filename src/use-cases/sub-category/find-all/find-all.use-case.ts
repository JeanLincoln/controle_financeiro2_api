import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";
import { ParamCategoryAuthenticatedRequest } from "@use-cases/category/find-and-validate/find-and-validate.use-case";

@Injectable()
export class FindAllSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    request: ParamCategoryAuthenticatedRequest
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
