import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { JwtAdapter } from "@domain/adapters/jwt";
import { UserRepository } from "@domain/repositories/user.repository";
import { User } from "@domain/entities/user.entity";
import { Injectable } from "@nestjs/common";

export interface AuthenticatedRequest extends Request {
  cookies: {
    authentication?: string;
  };
  user?: User;
}

@Injectable()
export class RouteAuthUseCase {
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly exceptionAdapter: ExceptionsAdapter,
    private readonly userRepository: UserRepository
  ) {}

  async execute(request: AuthenticatedRequest) {
    const token = request.cookies?.authentication;

    if (!token) {
      this.exceptionAdapter.unauthorized();
      return false;
    }

    const userPayload = await this.jwtAdapter.verifyToken(token);

    if (!userPayload) {
      this.exceptionAdapter.forbidden();
      return false;
    }

    const user = await this.userRepository.findById(Number(userPayload.id));

    if (!user) {
      this.exceptionAdapter.forbidden();
      return false;
    }

    request.user = user;
    return true;
  }
}
