import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";

export interface SubCategoryAuthenticatedRequest extends AuthenticatedRequest {
  params: {
    categoryId: string;
    subCategoryId: string;
  };
  subCategory: SubCategory;
}

@Injectable()
export class FindAndValidateSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(request: SubCategoryAuthenticatedRequest): Promise<boolean> {
    const { user, params } = request;
    const categoryId = Number(params.categoryId);
    const subCategoryId = Number(params.subCategoryId);
    const userId = user.id;

    const subCategory =
      await this.subCategoryRepository.findById(subCategoryId);

    if (!subCategory) {
      this.exceptionsAdapter.notFound({
        message: "Sub category not found"
      });
      return false;
    }

    if (subCategory.category.user.id !== userId) {
      this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access this sub category"
      });
      return false;
    }

    if (subCategory.category.id !== categoryId) {
      this.exceptionsAdapter.badRequest({
        message: "This sub category does not belong to the category informed"
      });
      return false;
    }

    request.subCategory = subCategory;

    return true;
  }
}
