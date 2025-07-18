import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import {
  SubCategoryRepository,
  SubCategoryOptionsToUseCaseParams,
  SubCategoryOption
} from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";

@Injectable()
export class OptionsSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    userId: number,
    categoryId: number,
    queryParams: SubCategoryOptionsToUseCaseParams
  ): Promise<PaginatedResult<SubCategoryOption>> {
    const { sortOrder, limit, page, search } = queryParams;

    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const paginatedSubCategoriesOptions =
      await this.subCategoryRepository.options(userId, categoryId, {
        ...repositoryParams,
        sortOrder,
        search
      });

    const { data: subCategoriesOptions, total } = paginatedSubCategoriesOptions;

    return createPaginationResult(
      subCategoriesOptions,
      paginationParams,
      total
    );
  }
}
