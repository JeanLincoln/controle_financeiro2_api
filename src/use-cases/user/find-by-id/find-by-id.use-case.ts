import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import {
  UserRepository,
  type OnlyUserProps
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindByIdUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(id: number): Promise<OnlyUserProps | void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return this.exceptionsAdapter.notFound({
        message: "User not found"
      });
    }

    return user;
  }
}
