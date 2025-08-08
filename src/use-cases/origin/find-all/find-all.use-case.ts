import { Origin } from "@domain/entities/origin.entity";
import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import {
  OriginRepository,
  OriginFindAllToUseCase
} from "@domain/repositories/origin.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";

@Injectable()
export class FindAllOriginUseCase {
  constructor(
    private readonly originRepository: OriginRepository,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    userId: number,
    queryParams: OriginFindAllToUseCase
  ): Promise<PaginatedResult<Origin> | void> {
    const { limit, page, sortBy, sortOrder, name } = queryParams;

    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const paginatedOrigins = await this.originRepository.findAll(userId, {
      ...repositoryParams,
      sortBy,
      sortOrder,
      name
    });

    const { data: origins, total } = paginatedOrigins;

    return createPaginationResult(origins, paginationParams, total);
  }
}
