import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateFromParamCategoryUseCase } from "@use-cases/category/find-and-validate-from-param/find-and-validate-from-param.use-case";

@Injectable()
export class CategoryParamGuard implements CanActivate {
  constructor(
    private readonly findAndValidateCategoryUseCase: FindAndValidateFromParamCategoryUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateCategoryUseCase.execute(request);
  }
}
