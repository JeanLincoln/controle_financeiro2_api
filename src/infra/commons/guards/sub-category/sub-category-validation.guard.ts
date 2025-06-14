import { Injectable, type ExecutionContext, CanActivate } from "@nestjs/common";
import { SubCategoryValidationUseCase } from "@use-cases/sub-category/sub-category-find-and-validate/sub-category-find-and-validate.use-case";

@Injectable()
export class SubCategoryGuard implements CanActivate {
  constructor(
    private readonly subCategoryValidationUseCase: SubCategoryValidationUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.subCategoryValidationUseCase.execute(request);
  }
}
