import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import {
  CategoryRepository,
  CreateOrUpdateAllCategoryProps
} from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(category: CreateOrUpdateAllCategoryProps): Promise<void> {
    const userExists = await this.userRepository.findById(category.userId);

    if (!userExists) {
      this.exceptionsAdapter.notFound({
        message: "User not found"
      });
      return;
    }

    await this.categoryRepository.create(category);
  }
}
