import { Category } from "@domain/entities/category.entity";
import { CategoryRepository } from "@domain/repositories/category.repository";

export class CategoryRepositoryStub implements CategoryRepository {
  async create(): Promise<void> {
    return Promise.resolve();
  }

  async findAll(): Promise<Category[]> {
    return Promise.resolve([]);
  }

  async findById(): Promise<Category | null> {
    return Promise.resolve(null);
  }

  async update(): Promise<void> {
    return Promise.resolve();
  }

  async delete(): Promise<void> {
    return Promise.resolve();
  }
}
