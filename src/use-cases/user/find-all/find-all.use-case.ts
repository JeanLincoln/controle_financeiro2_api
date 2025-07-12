import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import {
  UserRepository,
  UserWithoutPassword
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";

@Injectable()
export class FindAllUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly paginationUseCase: PaginationUseCase
  ) {}

  async execute(
    page?: number,
    limit?: number
  ): Promise<PaginatedResult<UserWithoutPassword>> {
    const { paginationParams, repositoryParams, createPaginationResult } =
      await this.paginationUseCase.execute(page, limit);

    const paginatedUsers = await this.userRepository.findAll(repositoryParams);

    const { data: users, total } = paginatedUsers;

    return createPaginationResult(users, paginationParams, total);
  }
}
