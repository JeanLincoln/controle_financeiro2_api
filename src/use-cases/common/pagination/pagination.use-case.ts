import {
  PaginationParams,
  PaginatedResult,
  PaginationMeta,
  RepositoryPaginationParams
} from "@domain/entities/common/pagination.entity";
import { Injectable } from "@nestjs/common";

export const PAGINATION_DEFAULT_PAGE = 1;
export const PAGINATION_DEFAULT_LIMIT = 10;
export const PAGINATION_MAX_LIMIT = 50;

@Injectable()
export class PaginationUseCase {
  async execute(page?: number, limit?: number) {
    const paginationParams = this.validateAndNormalizePagination(page, limit);

    const repositoryParams = this.toRepositoryParams(paginationParams);

    return {
      repositoryParams,
      paginationParams,
      createPaginationResult: this.createPaginatedResult.bind(this)
    };
  }

  private validateAndNormalizePagination(
    page?: number,
    limit?: number
  ): PaginationParams {
    const normalizedPage = Math.max(page || PAGINATION_DEFAULT_PAGE, 1);
    const normalizedLimit = Math.min(
      Math.max(limit || PAGINATION_DEFAULT_LIMIT, 1),
      PAGINATION_MAX_LIMIT
    );

    return {
      page: normalizedPage,
      limit: normalizedLimit
    };
  }

  private toRepositoryParams(
    paginationParams: PaginationParams
  ): RepositoryPaginationParams {
    const { page, limit } = paginationParams;
    return {
      skip: (page - 1) * limit,
      take: limit
    };
  }

  private createMeta(
    paginationParams: PaginationParams,
    total: number
  ): PaginationMeta {
    const { page, limit } = paginationParams;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
    const firstPageItem = total > 0 ? (page - 1) * limit + 1 : 0;
    const lastPageItem = total > 0 ? Math.min(page * limit, total) : 0;

    return {
      firstPage: 1,
      lastPage: totalPages,
      page,
      from: firstPageItem,
      to: lastPageItem,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };
  }

  private createPaginatedResult<T>(
    data: T[],
    paginationParams: PaginationParams,
    total: number
  ): PaginatedResult<T> {
    return {
      data,
      pagination: this.createMeta(paginationParams, total)
    };
  }
}
