import { CryptographyAdapter } from "@domain/adapters/cryptography";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  CreateOrUpdatePutUserProps,
  UserRepository
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly cryptographyAdapter: CryptographyAdapter
  ) {}

  async execute(user: CreateOrUpdatePutUserProps): Promise<void> {
    const userAlreadyExists = await this.userRepository.findByEmail(user.email);

    if (userAlreadyExists) {
      return this.exceptionsAdapter.badRequest({
        message: "User already exists"
      });
    }

    const hashedPassword = await this.cryptographyAdapter.hash(user.password);

    await this.userRepository.create({
      ...user,
      password: hashedPassword
    });
  }
}
