import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";
import {
  CreateOrUpdateAllUserProps,
  UserRepository
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptographyAdapter: CryptographyAdapter
  ) {}

  async execute(
    userId: number,
    user: CreateOrUpdateAllUserProps
  ): Promise<void> {
    const hashedPassword = await this.cryptographyAdapter.hash(user.password);

    await this.userRepository.update(userId, {
      ...user,
      password: hashedPassword
    });
  }
}
