import {
  UserRepository,
  UserWithoutRelations
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";

@Injectable()
export class FindByEmailUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(email: string): Promise<UserWithoutRelations | void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      this.exceptionsAdapter.notFound({ message: "User not found" });
      return;
    }

    return user;
  }
}
