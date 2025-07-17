import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateSubCategoryUseCase } from "@use-cases/sub-category/find-and-validate/find-and-validate.use-case";

@Injectable()
export class SubCategoryValidationGuard implements CanActivate {
  constructor(
    private readonly findAndValidateSubCategoryUseCase: FindAndValidateSubCategoryUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateSubCategoryUseCase.execute(request);
  }
}
