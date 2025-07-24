import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";

export class SubCategoryRepositoryStub implements SubCategoryRepository {
  async create() {
    return Promise.resolve();
  }

  async findAllByCategory() {
    return Promise.resolve([]);
  }

  async options() {
    return Promise.resolve({
      data: [],
      total: 0
    });
  }

  async findById() {
    return Promise.resolve(null);
  }

  async findByIds() {
    return Promise.resolve([]);
  }

  async update() {
    return Promise.resolve();
  }

  async delete() {
    return Promise.resolve();
  }

  async getCurrentMonthTopFiveSubCategories() {
    return Promise.resolve([]);
  }
}
