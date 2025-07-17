import { CreateOrUpdateAllSubCategoryProps } from "@domain/repositories/sub-category.repository";
import { EXPENSE_CATEGORY_MOCK } from "./category.mock";
import { INCOME_CATEGORY_MOCK } from "./category.mock";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { USER_MOCK, USER_MOCK_2 } from "./user.mock";
import {
  BodySubCategoriesAuthenticatedRequest,
  ParamSubCategoryAuthenticatedRequest,
  QuerySubCategoryAuthenticatedRequest
} from "@use-cases/sub-category/find-and-validate/find-and-validate.use-case";

export const CREATE_SUB_CATEGORY_MOCK: CreateOrUpdateAllSubCategoryProps = {
  name: "Sub Category",
  description: "Sub Category Description",
  color: "#000000",
  icon: "🍎"
};

export const SUB_CATEGORIES_MOCK: SubCategory[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    name: `Sub Category ${index + 1}`,
    description: `Sub Category ${index + 1} Description`,
    categoryId: (index + 1) % 2 === 0 ? 1 : 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: "#000000",
    icon: "🍎",
    transactions: [],
    category:
      (index + 1) % 2 === 0 ? INCOME_CATEGORY_MOCK : EXPENSE_CATEGORY_MOCK
  })
);

export const SUB_CATEGORY_MOCK_1: SubCategory = SUB_CATEGORIES_MOCK[0];
export const SUB_CATEGORY_MOCK_2: SubCategory = SUB_CATEGORIES_MOCK[1];

export const USER_1_SUB_CATEGORIES_MOCK: SubCategory[] =
  SUB_CATEGORIES_MOCK.filter(
    (subCategory) => subCategory.category.user.id === USER_MOCK.id
  );

export const USER_2_SUB_CATEGORIES_MOCK: SubCategory[] =
  SUB_CATEGORIES_MOCK.filter(
    (subCategory) => subCategory.category.user.id === USER_MOCK_2.id
  );

export const PARAM_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  params: {
    subCategoryId: SUB_CATEGORY_MOCK_1.id.toString()
  }
} as ParamSubCategoryAuthenticatedRequest;

export const QUERY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  query: {
    subCategoriesIds: USER_1_SUB_CATEGORIES_MOCK.map((subCategory) =>
      subCategory.id.toString()
    )
  }
} as QuerySubCategoryAuthenticatedRequest;

export const BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: {
    subCategoriesIds: USER_1_SUB_CATEGORIES_MOCK.map(
      (subCategory) => subCategory.id
    )
  }
} as BodySubCategoriesAuthenticatedRequest;

export const NO_CONTENT_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK
} as ParamSubCategoryAuthenticatedRequest;

export const EMPTY_QUERY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  query: {
    subCategoriesIds: [] as string[]
  }
} as QuerySubCategoryAuthenticatedRequest;

export const EMPTY_BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: {
    subCategoriesIds: [] as number[]
  }
} as BodySubCategoriesAuthenticatedRequest;
