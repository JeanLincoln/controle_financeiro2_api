import { Category } from "@domain/entities/category.entity";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: number): Promise<Category[] | void> {
    return this.categoryRepository.findAll(userId);
  }
}
