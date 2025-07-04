import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { RouteAuthUseCase } from "@use-cases/auth/route-auth/route-auth.use-case";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly routeAuthUseCase: RouteAuthUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.routeAuthUseCase.execute(request);
  }
}
