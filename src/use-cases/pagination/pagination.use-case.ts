import {
  PaginationParams,
  type PaginatedResult,
  type PaginationMeta,
  type RepositoryPaginationParams
} from "@domain/entities/pagination.entity";
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
    const totalPages = Math.ceil(total / limit);

    return {
      page,
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
      meta: this.createMeta(paginationParams, total)
    };
  }
}
