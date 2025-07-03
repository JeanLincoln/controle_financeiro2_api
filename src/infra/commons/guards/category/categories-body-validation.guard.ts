import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateManyFromBodyCategoryUseCase } from "@use-cases/category/find-and-validate-many-from-body/find-and-validate-many-from-body.use-case";

@Injectable()
export class CategoriesBodyGuard implements CanActivate {
  constructor(
    private readonly findAndValidateManyCategoryUseCase: FindAndValidateManyFromBodyCategoryUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateManyCategoryUseCase.execute(request);
  }
}
