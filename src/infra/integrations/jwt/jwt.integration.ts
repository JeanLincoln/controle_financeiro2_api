import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { JwtAdapter, JwtSignPayload } from "@domain/adapters/jwt.adapter";
import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { handleAsync } from "src/utils/handle-async.util";

@Injectable()
export class JwtIntegration implements JwtAdapter {
  constructor(
    private readonly jwtService: JwtService,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async generateToken(
    payload: JwtSignPayload,
    options: JwtSignOptions
  ): Promise<string> {
    return this.jwtService.sign(payload, options);
  }

  async verifyToken(token: string): Promise<Record<string, string> | void> {
    const [error, result] = await handleAsync(
      this.jwtService.verifyAsync(token)
    );

    if (error) {
      return this.exceptionsAdapter.forbidden({ message: "Invalid token" });
    }

    return result;
  }
}
