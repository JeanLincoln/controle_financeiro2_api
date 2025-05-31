import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { User } from "@domain/entities/user.entity";
import { UserRepository } from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindByIdUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(id: number): Promise<User | void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return this.exceptionsAdapter.notFound({
        message: "User not found"
      });
    }

    return user;
  }
}
