import { CreateOrUpdateAllSubCategoryProps } from "@domain/repositories/sub-category.repository";
import {
  EXPENSE_CATEGORY_MOCK,
  EXPENSE_CATEGORY_MOCK_2
} from "./category.mock";
import { INCOME_CATEGORY_MOCK } from "./category.mock";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { USER_MOCK, USER_MOCK_2 } from "./user.mock";
import { SubCategoryAuthenticatedRequest } from "@use-cases/sub-category/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { ManySubCategoriesAuthenticatedRequest } from "@use-cases/sub-category/find-and-validate-many-from-body/find-and-validate-many-from-body.use-case";

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

export const USER_MOCK_1_SUB_CATEGORIES: SubCategory[] =
  SUB_CATEGORIES_MOCK.filter(
    (subCategory) => subCategory.category.user.id === USER_MOCK.id
  );

export const USER_MOCK_2_SUB_CATEGORIES: SubCategory[] =
  SUB_CATEGORIES_MOCK.filter(
    (subCategory) => subCategory.category.user.id === USER_MOCK_2.id
  );

export const SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  params: {
    categoryId: EXPENSE_CATEGORY_MOCK.id.toString(),
    subCategoryId: SUB_CATEGORY_MOCK_1.id.toString()
  }
} as SubCategoryAuthenticatedRequest;

export const SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK_2 = {
  user: USER_MOCK,
  params: {
    categoryId: EXPENSE_CATEGORY_MOCK_2.id.toString(),
    subCategoryId: SUB_CATEGORY_MOCK_1.id.toString()
  }
} as SubCategoryAuthenticatedRequest;

export const MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: {
    subCategoriesIds: USER_MOCK_1_SUB_CATEGORIES.map(
      (subCategory) => subCategory.id
    )
  }
} as ManySubCategoriesAuthenticatedRequest;
