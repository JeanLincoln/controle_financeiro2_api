import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import {
  BaseCreateOrUpdateUserProps,
  UserRepository,
  UserWithoutRelations
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(
    user: UserWithoutRelations,
    updateProps: BaseCreateOrUpdateUserProps
  ): Promise<void> {
    const emailMaintained = user.email === updateProps.email;

    const emailAlreadyExists = await this.userRepository.findByEmail(
      updateProps.email
    );

    const emailAlreadyExistsAndItsNotTheSame =
      emailAlreadyExists && !emailMaintained;

    if (emailAlreadyExistsAndItsNotTheSame) {
      this.exceptionsAdapter.badRequest({
        message: "Email already in use"
      });
      return;
    }

    const hashedPassword = await this.cryptographyAdapter.hash(user.password);

    await this.userRepository.update(user.id, {
      ...updateProps,
      password: hashedPassword
    });
  }
}
