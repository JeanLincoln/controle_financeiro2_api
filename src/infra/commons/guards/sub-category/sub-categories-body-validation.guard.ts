import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateManyFromBodySubCategoryUseCase } from "@use-cases/sub-category/find-and-validate-many-from-body/find-and-validate-many-from-body.use-case";

@Injectable()
export class SubCategoriesBodyGuard implements CanActivate {
  constructor(
    private readonly findAndValidateManySubCategoryUseCase: FindAndValidateManyFromBodySubCategoryUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateManySubCategoryUseCase.execute(request);
  }
}
