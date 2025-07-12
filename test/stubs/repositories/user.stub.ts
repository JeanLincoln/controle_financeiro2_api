import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
import { User } from "@domain/entities/user.entity";
import { UserRepository } from "@domain/repositories/user.repository";

export class UserRepositoryStub implements UserRepository {
  async create(): Promise<void> {
    return Promise.resolve();
  }

  async findAll(): Promise<RepositoryToPaginationReturn<User>> {
    return Promise.resolve({ data: [], total: 0 });
  }

  async findById(): Promise<User> {
    return Promise.resolve({} as User);
  }

  async findByEmail(): Promise<User> {
    return Promise.resolve({} as User);
  }

  async findUserWithAllProps(): Promise<User | null> {
    return Promise.resolve(null);
  }

  async update(): Promise<void> {
    return Promise.resolve();
  }

  async delete(): Promise<void> {
    return Promise.resolve();
  }
}
