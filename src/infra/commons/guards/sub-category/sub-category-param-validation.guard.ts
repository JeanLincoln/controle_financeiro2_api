import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateFromParamSubCategoryUseCase } from "@use-cases/sub-category/find-and-validate-from-param/find-and-validate-from-param.use-case";

@Injectable()
export class SubCategoryParamGuard implements CanActivate {
  constructor(
    private readonly findAndValidateSubCategoryUseCase: FindAndValidateFromParamSubCategoryUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateSubCategoryUseCase.execute(request);
  }
}
