import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import {
  CategoryRepository,
  CategoryOption,
  CategoryOptionsToUseCaseParams
} from "@domain/repositories/category.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";

@Injectable()
export class OptionsCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    userId: number,
    queryParams: CategoryOptionsToUseCaseParams
  ): Promise<PaginatedResult<CategoryOption>> {
    const { sortOrder, limit, page, search } = queryParams;

    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const paginatedCategoriesOptions = await this.categoryRepository.options(
      userId,
      {
        ...repositoryParams,
        sortOrder,
        search
      }
    );

    const { data: categoriesOptions, total } = paginatedCategoriesOptions;

    return createPaginationResult(categoriesOptions, paginationParams, total);
  }
}
