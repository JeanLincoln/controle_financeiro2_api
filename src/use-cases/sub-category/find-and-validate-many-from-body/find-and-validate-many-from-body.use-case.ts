import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";

export interface ManySubCategoriesBody
  extends ReadableStream<Uint8Array<ArrayBufferLike>> {
  subCategoriesIds: number[];
}

export interface ManySubCategoriesAuthenticatedRequest
  extends AuthenticatedRequest {
  body: ManySubCategoriesBody;
  subCategories: SubCategory[];
}

@Injectable()
export class FindAndValidateManyFromBodySubCategoryUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(
    request: ManySubCategoriesAuthenticatedRequest
  ): Promise<boolean> {
    const { user, body } = request;
    const subCategoriesIds = body.subCategoriesIds;
    const userId = user.id;

    const subCategories =
      await this.subCategoryRepository.findByIds(subCategoriesIds);

    if (!subCategories) {
      this.exceptionsAdapter.notFound({
        message:
          "There was an error while fetching sub categories, please try again"
      });
      return false;
    }

    const subCategoriesArraysDoNotMatch =
      subCategoriesIds.length !== subCategories.length;

    if (subCategoriesArraysDoNotMatch) {
      this.exceptionsAdapter.notFound({
        message: "Some sub categories were not found, please try again"
      });
      return false;
    }

    const notOwsSomeSubCategory = subCategories.some(
      (subCategory) => subCategory.category.user.id !== userId
    );

    if (notOwsSomeSubCategory) {
      this.exceptionsAdapter.forbidden({
        message:
          "You are not allowed to access one or more of these sub categories"
      });
      return false;
    }

    request.subCategories = subCategories;

    return true;
  }
}
