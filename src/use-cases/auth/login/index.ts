import { CryptographyAdapter } from "@domain/adapters/cryptography";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { JwtAdapter } from "@domain/adapters/jwt";
import { UserRepository } from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly userRepository: UserRepository,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly cryptographyAdapter: CryptographyAdapter
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return this.exceptionAdapter.forbidden();
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
        expiresIn: "2 days",
        subject: user.id.toString(),
        issuer: "controle-financeiro",
        audience: "users"
      }
    );

    return {
      accessToken: `Bearer ${accessToken}`
    };
  }
}
