import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateOriginFromParamUseCase } from "@use-cases/origin/find-and-validate-from-param/find-and-validate-from-param.use-case";

@Injectable()
export class OriginParamGuard implements CanActivate {
  constructor(
    private readonly findAndValidateOriginFromParamUseCase: FindAndValidateOriginFromParamUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateOriginFromParamUseCase.execute(request);
  }
}
