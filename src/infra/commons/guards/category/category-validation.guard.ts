import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateCategoryUseCase } from "@use-cases/category/find-and-validate/find-and-validate.use-case";

@Injectable()
export class CategoryValidationGuard implements CanActivate {
  constructor(
    private readonly findAndValidateCategoryUseCase: FindAndValidateCategoryUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateCategoryUseCase.execute(request);
  }
}
