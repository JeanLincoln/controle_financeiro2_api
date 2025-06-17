import { CreateOrUpdateAllSubCategoryProps } from "@domain/repositories/sub-category.repository";
import { EXPENSE_CATEGORY_MOCK } from "./category.mock";
import { INCOME_CATEGORY_MOCK } from "./category.mock";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { USER_MOCK } from "./user.mock";
import { SubCategoryAuthenticatedRequest } from "@use-cases/sub-category/find-and-validate/find-and-validate.use-case";

export const CREATE_SUB_CATEGORY_MOCK: CreateOrUpdateAllSubCategoryProps = {
  name: "Sub Category",
  description: "Sub Category Description",
  categoryId: 1,
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

export const SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  params: {
    id: "1"
  }
} as SubCategoryAuthenticatedRequest;
