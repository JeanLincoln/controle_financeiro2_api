import { User } from "@domain/entities/user.entity";
import {
  CategoryRepository,
  CreateOrUpdateAllCategoryProps,
  type CreateCategoryReturn
} from "@domain/repositories/category.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    user: User,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<CreateCategoryReturn | void> {
    return this.categoryRepository.create(user, category);
  }
}
