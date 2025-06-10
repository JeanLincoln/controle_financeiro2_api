import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";

export class SubCategoryRepositoryStub extends SubCategoryRepository {
  async create() {
    return Promise.resolve();
  }

  async findAllByUserId() {
    return Promise.resolve([]);
  }

  async findById() {
    return Promise.resolve(null);
  }

  async update() {
    return Promise.resolve();
  }

  async delete() {
    return Promise.resolve();
  }
}
