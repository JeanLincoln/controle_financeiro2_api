import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateOriginUseCase } from "@use-cases/origin/find-and-validate/find-and-validate.use-case";

@Injectable()
export class OriginValidationGuard implements CanActivate {
  constructor(
    private readonly findAndValidateOriginUseCase: FindAndValidateOriginUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateOriginUseCase.execute(request);
  }
}
