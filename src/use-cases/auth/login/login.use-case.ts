import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { JwtAdapter } from "@domain/adapters/jwt.adapter";
import {
  UserRepository,
  UserWithoutPassword
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";
import { Response } from "express";

const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;
const TOKEN_EXPIRATION = TWO_DAYS_IN_MS;
@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly userRepository: UserRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly cryptographyAdapter: CryptographyAdapter
  ) {}

  async execute(
    email: string,
    password: string,
    response: Response
  ): Promise<UserWithoutPassword | void> {
    const user = await this.userRepository.findUserWithAllProps({
      email: email
    });

    if (!user) {
      return this.exceptionAdapter.forbidden({
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await this.cryptographyAdapter.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return this.exceptionAdapter.wrongCredentials();
    }

    const accessToken = await this.jwtAdapter.generateToken(
      {
        id: user.id.toString()
      },
      {
        expiresIn: TOKEN_EXPIRATION,
        subject: user.id.toString(),
        issuer: "controle-financeiro",
        audience: "users"
      }
    );

    response.cookie("Authorization", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: TOKEN_EXPIRATION
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
