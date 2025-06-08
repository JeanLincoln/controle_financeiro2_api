import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(userId: number, id: number): Promise<void> {
    if (userId !== id) {
      return this.exceptionsAdapter.forbidden({
        message: "You are not allowed to delete this user"
      });
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      return this.exceptionsAdapter.notFound({
        message: "User not found"
      });
    }

    await this.categoryRepository.deleteByUserId(id);
    await this.userRepository.delete(id);
  }
}
