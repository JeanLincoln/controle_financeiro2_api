import { Category } from "@domain/entities/category.entity";
import { PaginatedResult } from "@domain/entities/pagination.entity";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/pagination/pagination.use-case";

@Injectable()
export class FindAllCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    userId: number,
    page?: number,
    limit?: number
  ): Promise<PaginatedResult<Category> | void> {
    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const paginatedCategories = await this.categoryRepository.findAll(
      userId,
      repositoryParams
    );

    const { data: categories, total } = paginatedCategories;

    return createPaginationResult(categories, paginationParams, total);
  }
}
