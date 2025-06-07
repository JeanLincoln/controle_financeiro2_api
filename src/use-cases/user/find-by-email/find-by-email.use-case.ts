import { UserRepository } from "@domain/repositories/user.repository";
import { User } from "@domain/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";

@Injectable()
export class FindByEmailUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(email: string): Promise<User | void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      this.exceptionsAdapter.notFound({ message: "User not found" });
      return;
    }

    return user;
  }
}
