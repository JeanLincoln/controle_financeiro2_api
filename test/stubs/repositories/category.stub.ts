import { Category } from "@domain/entities/category.entity";
import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
import { CategoryRepository } from "@domain/repositories/category.repository";

export class CategoryRepositoryStub implements CategoryRepository {
  async create(): Promise<void> {
    return Promise.resolve();
  }

  async findAll(): Promise<RepositoryToPaginationReturn<Category>> {
    return Promise.resolve({ data: [], total: 0 });
  }

  async options(): Promise<RepositoryToPaginationReturn<Category>> {
    return Promise.resolve({ data: [], total: 0 });
  }

  async findById(): Promise<Category | null> {
    return Promise.resolve(null);
  }

  async findByIds(): Promise<Category[]> {
    return Promise.resolve([]);
  }

  async update(): Promise<void> {
    return Promise.resolve();
  }

  async delete(): Promise<void> {
    return Promise.resolve();
  }

  async deleteByUserId(): Promise<void> {
    return Promise.resolve();
  }
}
