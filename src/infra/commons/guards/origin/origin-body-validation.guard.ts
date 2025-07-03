import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateOriginFromBodyUseCase } from "@use-cases/origin/find-and-validate-from-body/find-and-validate-from-body.use-case";

@Injectable()
export class OriginBodyGuard implements CanActivate {
  constructor(
    private readonly findAndValidateOriginFromBodyUseCase: FindAndValidateOriginFromBodyUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateOriginFromBodyUseCase.execute(request);
  }
}
