import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { Category } from "@domain/entities/category.entity";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindByIdCategoryUseCase {
  constructor(
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: number, id: number): Promise<Category | void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exceptionsAdapter.notFound({
        message: "User not found"
      });
    }

    const category = await this.categoryRepository.findById(id);

    if (!category) {
      return this.exceptionsAdapter.notFound({
        message: "Category not found"
      });
    }

    if (category.user.id !== userId) {
      return this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access this category"
      });
    }

    return category;
  }
}
