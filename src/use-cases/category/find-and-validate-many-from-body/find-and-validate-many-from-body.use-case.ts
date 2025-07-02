import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { Category } from "@domain/entities/category.entity";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";

export interface ManyCategoriesBody
  extends ReadableStream<Uint8Array<ArrayBufferLike>> {
  categoriesIds: number[];
}

export interface ManyCategoriesAuthenticatedRequest
  extends AuthenticatedRequest {
  body: ManyCategoriesBody;
  categories: Category[];
}

@Injectable()
export class FindAndValidateManyFromBodyCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(request: ManyCategoriesAuthenticatedRequest): Promise<boolean> {
    const { user, body } = request;
    const categoriesIds = body.categoriesIds;
    const userId = user.id;

    const categories = await this.categoryRepository.findByIds(categoriesIds);

    if (!categories) {
      this.exceptionsAdapter.notFound({
        message:
          "There was an error while fetching categories, please try again"
      });
      return false;
    }

    const categoriesArraysDoNotMatch =
      categoriesIds.length !== categories.length;

    if (categoriesArraysDoNotMatch) {
      this.exceptionsAdapter.notFound({
        message: "Some categories were not found, please try again"
      });
      return false;
    }

    const notOwsSomeCategory = categories.some(
      (category) => category.user.id !== userId
    );

    if (notOwsSomeCategory) {
      this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access one or more of these categories"
      });
      return false;
    }

    request.categories = categories;

    return true;
  }
}
