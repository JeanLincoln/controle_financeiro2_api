import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";
import {
  SubCategoryRepository,
  SubCategoryFindAllToUseCase
} from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";

@Injectable()
export class FindAllSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    userId: number,
    queryParams: SubCategoryFindAllToUseCase
  ): Promise<PaginatedResult<SubCategory> | void> {
    const { limit, page, sortBy, sortOrder, name, categoriesIds } = queryParams;

    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const paginatedSubCategories = await this.subCategoryRepository.findAll(
      userId,
      {
        ...repositoryParams,
        sortBy,
        sortOrder,
        name,
        categoriesIds
      }
    );

    if (!paginatedSubCategories) {
      return this.exceptionAdapter.notFound({
        message: "Something went wrong while fetching sub-categories"
      });
    }

    const { data: subCategories, total } = paginatedSubCategories;

    return createPaginationResult(subCategories, paginationParams, total);
  }
}
