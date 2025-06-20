import { Category } from "@domain/entities/category.entity";
import {
  CreateOrUpdateAllSubCategoryProps,
  SubCategoryRepository
} from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";
import {
  FindAndValidateCategoryUseCase,
  CategoryAuthenticatedRequest
} from "@use-cases/category/find-and-validate/find-and-validate.use-case";

@Injectable()
export class CreateSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly findAndValidateCategoryUseCase: FindAndValidateCategoryUseCase
  ) {}

  async execute(
    request: CategoryAuthenticatedRequest,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ) {
    const { params } = request;
    const categoryId = Number(params.categoryId);

    await this.findAndValidateCategoryUseCase.execute({
      ...request,
      params: { categoryId: categoryId.toString() },
      category: {} as Category
    });

    await this.subCategoryRepository.create(categoryId, subCategory);
  }
}
