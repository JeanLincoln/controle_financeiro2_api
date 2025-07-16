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
    categoriesId: string | string[];
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

  private handlers: Record<
    string,
    (userId: number, request: FindAndValidateRequestType) => boolean
  > = {
    param: this.handleParamCategoryRequest.bind(this),
    body: this.handleBodyCategoriesRequest.bind(this),
    query: this.handleQueryCategoriesRequest.bind(this)
  };

  private isParamCategoryRequest(request: FindAndValidateRequestType) {
    return (
      "params" in request &&
      typeof request.params === "object" &&
      "categoryId" in (request as ParamCategoryAuthenticatedRequest).params
    );
  }

  private isBodyCategoriesRequest(request: FindAndValidateRequestType) {
    return (
      "body" in request &&
      request.body &&
      typeof request.body === "object" &&
      "categoriesIds" in request.body
    );
  }

  private isQueryCategoriesRequest(request: FindAndValidateRequestType) {
    return (
      "query" in request &&
      typeof request.query === "object" &&
      "categoriesIds" in request.query
    );
  }

  private getRequestType(request: FindAndValidateRequestType): string | null {
    if (this.isParamCategoryRequest(request)) return "param";
    if (this.isBodyCategoriesRequest(request)) return "body";
    if (this.isQueryCategoriesRequest(request)) return "query";
    return null;
  }

  private async handleParamCategoryRequest(
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

  private async handleQueryCategoriesRequest(
    userId: number,
    request: QueryCategoryAuthenticatedRequest
  ): Promise<boolean> {
    const validatedRequest = request;
    const { categoriesId } = validatedRequest.query;
    const categoriesIds = Array.isArray(categoriesId)
      ? categoriesId.map(Number)
      : [Number(categoriesId)];

    const response = await this.validateRequest(userId, categoriesIds);

    if (!response || !response.categories || response.categories.length === 0) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the category."
      });
      return false;
    }

    request.categories = response.categories;

    return true;
  }

  private async handleBodyCategoriesRequest(
    userId: number,
    request: BodyCategoriesAuthenticatedRequest
  ): Promise<boolean> {
    const categoriesIds = request.body.categoriesIds;

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

  private async validateRequest(
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
    const type = this.getRequestType(request);
    const { user } = request;
    const userId = user.id;

    if (!type) {
      this.exceptionsAdapter.internalServerError({
        message: "Invalid request type for category validation"
      });
      return false;
    }

    return this.handlers[type](userId, request);
  }
}
