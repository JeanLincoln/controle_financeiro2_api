import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  CreateOrUpdateAllUserProps,
  UserRepository
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(id: number, user: CreateOrUpdateAllUserProps): Promise<void> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return this.exceptionsAdapter.notFound({
        message: "User not found"
      });
    }

    await this.userRepository.update(id, user);
  }
}
