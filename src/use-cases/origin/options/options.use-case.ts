import { Origin } from "@domain/entities/origin.entity";
import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import {
  OriginRepository,
  OriginOptionsToUseCaseParams
} from "@domain/repositories/origin.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";

@Injectable()
export class OptionsOriginUseCase {
  constructor(
    private readonly originRepository: OriginRepository,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    userId: number,
    queryParams: OriginOptionsToUseCaseParams
  ): Promise<PaginatedResult<Origin> | void> {
    const { sortOrder, limit, page, search } = queryParams;

    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const paginatedOriginsOptions = await this.originRepository.options(
      userId,
      {
        ...repositoryParams,
        sortOrder,
        search
      }
    );

    const { data: originsOptions, total } = paginatedOriginsOptions;

    return createPaginationResult(originsOptions, paginationParams, total);
  }
}
