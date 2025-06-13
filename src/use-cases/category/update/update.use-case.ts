import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import {
  CategoryRepository,
  type CreateOrUpdateAllCategoryProps
} from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    userId: number,
    id: number,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void> {
    const userFound = await this.userRepository.findById(userId);

    if (!userFound) {
      return this.exceptionsAdapter.notFound({
        message: "User not found"
      });
    }

    const categoryFound = await this.categoryRepository.findById(id);

    if (!categoryFound) {
      return this.exceptionsAdapter.notFound({
        message: "Category not found"
      });
    }

    if (categoryFound.user.id !== userId) {
      return this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access this category"
      });
    }

    return this.categoryRepository.update(id, category);
  }
}
