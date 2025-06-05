import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { JwtAdapter } from "@domain/adapters/jwt.adapter";
import { UserRepository } from "@domain/repositories/user.repository";
import { User } from "@domain/entities/user.entity";
import { Injectable } from "@nestjs/common";

export interface AuthenticatedHeaders extends Headers {
  cookie?: string;
}

export interface AuthenticatedRequest extends Request {
  headers: AuthenticatedHeaders;
  user: User;
}

@Injectable()
export class RouteAuthUseCase {
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly userRepository: UserRepository
  ) {}

  async execute(request: AuthenticatedRequest) {
    const authorization = request.headers.cookie;

    if (!authorization) {
      this.exceptionAdapter.unauthorized();
      return false;
    }

    const [, token] = authorization.split("=");

    const userPayload = await this.jwtAdapter.verifyToken(token);

    if (!userPayload) {
      this.exceptionAdapter.forbidden({ message: "Invalid token" });
      return false;
    }

    const user = await this.userRepository.findById(Number(userPayload.id));

    if (!user) {
      this.exceptionAdapter.forbidden({ message: "Invalid token" });
      return false;
    }

    request.user = user;
    return true;
  }
}
