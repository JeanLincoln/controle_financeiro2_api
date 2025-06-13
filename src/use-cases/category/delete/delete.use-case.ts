import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(userId: number, id: number): Promise<void> {
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

    if (category.user.id !== user.id) {
      return this.exceptionsAdapter.forbidden({
        message: "You are not allowed to delete this category"
      });
    }

    await this.categoryRepository.delete(id);
  }
}
