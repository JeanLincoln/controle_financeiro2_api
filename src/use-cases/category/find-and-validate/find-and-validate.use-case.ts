import { Category } from "@domain/entities/category.entity";
import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CategoryRepository } from "@domain/repositories/category.repository";

export interface ParamCategoryAuthenticatedRequest
  extends AuthenticatedRequest {
  params: {
    categoryId: string;
  };
  category: Category;
}

export interface QueryCategoryAuthenticatedRequest
  extends AuthenticatedRequest {
  query: {
    categoriesIds: string | string[];
  };
  categories: Category[];
}

export interface BodyCategoriesAuthenticatedRequest
  extends Omit<AuthenticatedRequest, "body"> {
  body: {
    categoriesIds: number[];
  };
  categories: Category[];
}

type FindAndValidateRequestType =
  | BodyCategoriesAuthenticatedRequest
  | ParamCategoryAuthenticatedRequest
  | QueryCategoryAuthenticatedRequest;

export interface ValidateCategoriesUseCaseReturn {
  categories: Category[];
}

@Injectable()
export class FindAndValidateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  isParamCategoryRequest(request: FindAndValidateRequestType) {
    return (
      "params" in request &&
      typeof request.params === "object" &&
      "categoryId" in (request as ParamCategoryAuthenticatedRequest).params
    );
  }

  isBodyCategoriesRequest(request: FindAndValidateRequestType) {
    return (
      "body" in request &&
      request.body &&
      typeof request.body === "object" &&
      "categoriesIds" in request.body
    );
  }

  isQueryCategoriesRequest(request: FindAndValidateRequestType) {
    return (
      "query" in request &&
      typeof request.query === "object" &&
      "categoriesIds" in request.query
    );
  }

  async handleParamCategoryRequest(
    userId: number,
    request: ParamCategoryAuthenticatedRequest
  ): Promise<boolean> {
    const { params } = request;
    const categoryId = Number(params.categoryId);

    const response = await this.validateRequest(userId, [categoryId]);

    if (!response || !response.categories || response.categories.length === 0) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the category."
      });
      return false;
    }

    request.category = response.categories[0];

    return true;
  }

  async handleQueryCategoriesRequest(
    userId: number,
    request: QueryCategoryAuthenticatedRequest
  ): Promise<boolean> {
    const validatedRequest = request;
    const { categoriesIds } = validatedRequest.query;
    const formattedCategoriesIds = Array.isArray(categoriesIds)
      ? categoriesIds.map(Number)
      : [Number(categoriesIds)];

    if (formattedCategoriesIds.length === 0) {
      request.categories = [];
      return true;
    }

    const response = await this.validateRequest(userId, formattedCategoriesIds);

    if (!response || !response.categories || response.categories.length === 0) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the category."
      });
      return false;
    }

    request.categories = response.categories;

    return true;
  }

  async handleBodyCategoriesRequest(
    userId: number,
    request: BodyCategoriesAuthenticatedRequest
  ): Promise<boolean> {
    const categoriesIds = request.body.categoriesIds;

    if (categoriesIds.length === 0) {
      request.categories = [];
      return true;
    }

    const response = await this.validateRequest(userId, categoriesIds);

    if (!response || !response.categories || response.categories.length === 0) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the categories."
      });
      return false;
    }

    request.categories = response.categories;
    return true;
  }

  async validateRequest(
    userId: number,
    categoriesIds: number[]
  ): Promise<ValidateCategoriesUseCaseReturn | void> {
    const categories = await this.categoryRepository.findByIds(categoriesIds);

    if (!categories) {
      this.exceptionsAdapter.notFound({
        message:
          "There was an error while fetching categories, please try again"
      });
      return;
    }

    const categoriesArraysDoNotMatch =
      categoriesIds.length !== categories.length;

    if (categoriesArraysDoNotMatch) {
      this.exceptionsAdapter.notFound({
        message: "Some categories were not found, please try again"
      });
      return;
    }

    const notOwsSomeCategory = categories.some(
      (category) => category.user.id !== userId
    );

    if (notOwsSomeCategory) {
      this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access one or more of these categories"
      });
      return;
    }

    return { categories: categories };
  }

  async execute(request: FindAndValidateRequestType): Promise<boolean> {
    const { user } = request;
    const userId = user.id;

    const isAParamRequest = this.isParamCategoryRequest(request);
    const isAQueryRequest = this.isQueryCategoriesRequest(request);
    const isABodyRequest = this.isBodyCategoriesRequest(request);

    if (!isAParamRequest && !isABodyRequest && !isAQueryRequest) return true;

    if (isAParamRequest)
      return this.handleParamCategoryRequest(
        userId,
        request as ParamCategoryAuthenticatedRequest
      );

    if (isAQueryRequest)
      return this.handleQueryCategoriesRequest(
        userId,
        request as QueryCategoryAuthenticatedRequest
      );

    if (isABodyRequest)
      return this.handleBodyCategoriesRequest(
        userId,
        request as BodyCategoriesAuthenticatedRequest
      );

    this.exceptionsAdapter.internalServerError({
      message: "Invalid request type for category validation"
    });
    return false;
  }
}
