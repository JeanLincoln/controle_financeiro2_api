import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { Origin } from "@domain/entities/origin.entity";
import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import {
  OriginRepository,
  type OriginFindAllToUseCase
} from "@domain/repositories/origin.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";

@Injectable()
export class FindAllOriginUseCase {
  constructor(
    private readonly originRepository: OriginRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    userId: number,
    queryParams: OriginFindAllToUseCase
  ): Promise<PaginatedResult<Origin> | void> {
    const { sortBy, sortOrder, limit, page } = queryParams;

    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const paginatedOrigins = await this.originRepository.findAll(userId, {
      ...repositoryParams,
      sortBy,
      sortOrder
    });

    const atLeastOneOriginDoesntBelongToUser = paginatedOrigins.data.some(
      (origin) => origin.user.id !== userId
    );

    if (atLeastOneOriginDoesntBelongToUser) {
      this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access this origin"
      });
      return;
    }

    const { data: origins, total } = paginatedOrigins;

    return createPaginationResult(origins, paginationParams, total);
  }
}
