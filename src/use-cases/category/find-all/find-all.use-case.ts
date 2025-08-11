import { Category } from "@domain/entities/category.entity";
import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import {
  CategoryRepository,
  CategoryFindAllToUseCase
} from "@domain/repositories/category.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";

@Injectable()
export class FindAllCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    userId: number,
    queryParams: CategoryFindAllToUseCase
  ): Promise<PaginatedResult<Category> | void> {
    const { page, limit, sortBy, sortOrder, name } = queryParams;

    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const paginatedCategories = await this.categoryRepository.findAll(userId, {
      ...repositoryParams,
      name,
      sortBy,
      sortOrder
    });

    const { data: categories, total } = paginatedCategories;

    return createPaginationResult(categories, paginationParams, total);
  }
}
