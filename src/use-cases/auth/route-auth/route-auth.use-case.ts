import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { JwtAdapter } from "@domain/adapters/jwt.adapter";
import { User } from "@domain/entities/user.entity";
import { UserRepository } from "@domain/repositories/user.repository";
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

  private parseCookies(cookieHeader: string): Record<string, string> {
    return cookieHeader
      .split(";")
      .reduce((acc: Record<string, string>, cookie) => {
        const [name, ...rest] = cookie.trim().split("=");
        if (name && rest.length > 0) {
          acc[name] = rest.join("=");
        }
        return acc;
      }, {});
  }

  async execute(request: AuthenticatedRequest) {
    const cookieHeader = request.headers.cookie;

    if (!cookieHeader) {
      this.exceptionAdapter.unauthorized({ message: "Unauthorized" });
      return false;
    }

    const cookies = this.parseCookies(cookieHeader);
    const token = cookies.Authorization;

    if (!token) {
      this.exceptionAdapter.unauthorized({ message: "Unauthorized" });
      return false;
    }

    const userPayload = await this.jwtAdapter.verifyToken(token);

    if (!userPayload) {
      this.exceptionAdapter.forbidden({ message: "Invalid token" });
      return false;
    }

    const user = await this.userRepository.findUserWithAllProps({
      id: Number(userPayload.id)
    });

    if (!user) {
      this.exceptionAdapter.forbidden({ message: "Invalid token" });
      return false;
    }

    request.user = user;

    return true;
  }
}
