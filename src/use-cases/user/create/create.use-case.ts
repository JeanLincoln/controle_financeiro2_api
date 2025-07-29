import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import {
  BaseCreateOrUpdateUserProps,
  UserRepository
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";
import { LoginUseCase } from "@use-cases/auth/login/login.use-case";
import { Response } from "express";

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly loginUseCase: LoginUseCase
  ) {}

  async execute(
    user: BaseCreateOrUpdateUserProps,
    response: Response
  ): Promise<ReturnType<LoginUseCase["execute"]> | void> {
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

    return await this.loginUseCase.execute(user.email, user.password, response);
  }
}
