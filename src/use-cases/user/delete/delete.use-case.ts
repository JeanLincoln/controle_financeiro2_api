import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(userId: number): Promise<void> {
    await this.categoryRepository.deleteByUserId(userId);
    await this.userRepository.delete(userId);
  }
}
