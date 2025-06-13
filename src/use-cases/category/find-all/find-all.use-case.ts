import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { Category } from "@domain/entities/category.entity";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllCategoryUseCase {
  constructor(
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: number): Promise<Category[] | void> {
    const categories = await this.categoryRepository.findAll(userId);

    return categories;
  }
}
