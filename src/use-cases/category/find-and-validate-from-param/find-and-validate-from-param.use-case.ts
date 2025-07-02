import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { Category } from "@domain/entities/category.entity";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";

export interface CategoryAuthenticatedRequest extends AuthenticatedRequest {
  params: {
    categoryId: string;
  };
  category: Category;
}

@Injectable()
export class FindAndValidateFromParamCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(request: CategoryAuthenticatedRequest): Promise<boolean> {
    const { user, params } = request;
    const categoryId = Number(params.categoryId);
    const userId = user.id;

    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      this.exceptionsAdapter.notFound({
        message: "Category not found"
      });
      return false;
    }

    if (category.user.id !== userId) {
      this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access this category"
      });
      return false;
    }

    request.category = category;

    return true;
  }
}
