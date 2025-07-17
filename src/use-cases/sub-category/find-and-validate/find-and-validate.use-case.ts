import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";

export interface ParamSubCategoryAuthenticatedRequest
  extends AuthenticatedRequest {
  params: {
    subCategoryId: string;
  };
  subCategory: SubCategory;
}

export interface QuerySubCategoryAuthenticatedRequest
  extends AuthenticatedRequest {
  query: {
    subCategoriesIds: string | string[];
  };
  subCategories: SubCategory[];
}

export interface BodySubCategoriesAuthenticatedRequest
  extends Omit<AuthenticatedRequest, "body"> {
  body: {
    subCategoriesIds: number[];
  };
  subCategories: SubCategory[];
}

type FindAndValidateRequestType =
  | BodySubCategoriesAuthenticatedRequest
  | ParamSubCategoryAuthenticatedRequest
  | QuerySubCategoryAuthenticatedRequest;

export interface ValidateSubCategoriesUseCaseReturn {
  subCategories: SubCategory[];
}

@Injectable()
export class FindAndValidateSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  isParamSubCategoryRequest(request: FindAndValidateRequestType) {
    return (
      "params" in request &&
      typeof request.params === "object" &&
      "subCategoryId" in
        (request as ParamSubCategoryAuthenticatedRequest).params
    );
  }

  isBodySubCategoriesRequest(request: FindAndValidateRequestType) {
    return (
      "body" in request &&
      request.body &&
      typeof request.body === "object" &&
      "subCategoriesIds" in request.body
    );
  }

  isQuerySubCategoriesRequest(request: FindAndValidateRequestType) {
    return (
      "query" in request &&
      typeof request.query === "object" &&
      "subCategoriesIds" in request.query
    );
  }

  async handleParamSubCategoryRequest(
    userId: number,
    request: ParamSubCategoryAuthenticatedRequest
  ): Promise<boolean> {
    const { params } = request;
    const subCategoryId = Number(params.subCategoryId);

    const response = await this.validateRequest(userId, [subCategoryId]);

    if (
      !response ||
      !response.subCategories ||
      response.subCategories.length === 0
    ) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the sub-category."
      });
      return false;
    }

    request.subCategory = response.subCategories[0];

    return true;
  }

  async handleQuerySubCategoriesRequest(
    userId: number,
    request: QuerySubCategoryAuthenticatedRequest
  ): Promise<boolean> {
    const validatedRequest = request;
    const { subCategoriesIds } = validatedRequest.query;
    const formattedSubCategoriesIds = Array.isArray(subCategoriesIds)
      ? subCategoriesIds.map(Number)
      : [Number(subCategoriesIds)];

    const response = await this.validateRequest(
      userId,
      formattedSubCategoriesIds
    );

    if (
      !response ||
      !response.subCategories ||
      response.subCategories.length === 0
    ) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the sub-category."
      });
      return false;
    }

    request.subCategories = response.subCategories;

    return true;
  }

  async handleBodySubCategoriesRequest(
    userId: number,
    request: BodySubCategoriesAuthenticatedRequest
  ): Promise<boolean> {
    const subCategoriesIds = request.body.subCategoriesIds;

    const response = await this.validateRequest(userId, subCategoriesIds);

    if (
      !response ||
      !response.subCategories ||
      response.subCategories.length === 0
    ) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the sub-categories."
      });
      return false;
    }

    request.subCategories = response.subCategories;
    return true;
  }

  async validateRequest(
    userId: number,
    subCategoriesIds: number[]
  ): Promise<ValidateSubCategoriesUseCaseReturn | void> {
    const subCategories =
      await this.subCategoryRepository.findByIds(subCategoriesIds);

    if (!subCategories) {
      this.exceptionsAdapter.notFound({
        message: "The sub-category(ies) was/were not found, please try again"
      });
      return;
    }

    const subCategoriesArraysDoNotMatch =
      subCategoriesIds.length !== subCategories.length;

    if (subCategoriesArraysDoNotMatch) {
      this.exceptionsAdapter.notFound({
        message: "Some sub-categories were not found, please try again"
      });
      return;
    }

    const notOwsSomeSubCategory = subCategories.some(
      (subCategory) => subCategory.category.user.id !== userId
    );

    if (notOwsSomeSubCategory) {
      this.exceptionsAdapter.forbidden({
        message:
          "You are not allowed to access one or more of these sub-categories"
      });
      return;
    }

    return { subCategories: subCategories };
  }

  async execute(request: FindAndValidateRequestType): Promise<boolean> {
    const { user } = request;
    const userId = user.id;

    const isAParamRequest = this.isParamSubCategoryRequest(request);
    const isAQueryRequest = this.isQuerySubCategoriesRequest(request);
    const isABodyRequest = this.isBodySubCategoriesRequest(request);

    if (!isAParamRequest && !isABodyRequest && !isAQueryRequest) return true;

    if (isAParamRequest)
      return this.handleParamSubCategoryRequest(
        userId,
        request as ParamSubCategoryAuthenticatedRequest
      );

    if (isAQueryRequest)
      return this.handleQuerySubCategoriesRequest(
        userId,
        request as QuerySubCategoryAuthenticatedRequest
      );

    if (isABodyRequest)
      return this.handleBodySubCategoriesRequest(
        userId,
        request as BodySubCategoriesAuthenticatedRequest
      );

    this.exceptionsAdapter.internalServerError({
      message: "Invalid request type for sub-category validation"
    });
    return false;
  }
}
