import { CategoryType, Category } from "@domain/entities/category.entity";
import { USER_MOCK, USER_MOCK_2 } from "./user.mock";
import { CreateOrUpdateAllCategoryProps } from "@domain/repositories/category.repository";
import { CategoryAuthenticatedRequest } from "@use-cases/category/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { ManyCategoriesAuthenticatedRequest } from "@use-cases/category/find-and-validate-many-from-body/find-and-validate-many-from-body.use-case";

export const CREATE_OR_UPDATE_CATEGORY_MOCK: CreateOrUpdateAllCategoryProps = {
  name: "Category",
  description: "Category description",
  type: CategoryType.INCOME,
  color: "#FF0000",
  icon: "test-icon"
};

export const CATEGORIES_MOCK: Category[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    name: `Category ${index + 1}`,
    description: `Category ${index + 1} description`,
    type: (index + 1) % 2 === 0 ? CategoryType.INCOME : CategoryType.EXPENSE,
    color: "#FF0000",
    icon: "test-icon",
    userId: (index + 1) % 2 === 0 ? 2 : 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    subCategories: [],
    transactions: [],
    user: (index + 1) % 2 === 0 ? USER_MOCK_2 : USER_MOCK
  })
);

export const INCOME_CATEGORIES_MOCK: Category[] = CATEGORIES_MOCK.filter(
  (category) => category.type === CategoryType.INCOME
);

export const EXPENSE_CATEGORIES_MOCK: Category[] = CATEGORIES_MOCK.filter(
  (category) => category.type === CategoryType.EXPENSE
);

export const INCOME_CATEGORY_MOCK: Category = INCOME_CATEGORIES_MOCK[0];

export const INCOME_CATEGORY_MOCK_2: Category = INCOME_CATEGORIES_MOCK[1];

export const EXPENSE_CATEGORY_MOCK: Category = EXPENSE_CATEGORIES_MOCK[0];

export const EXPENSE_CATEGORY_MOCK_2: Category = EXPENSE_CATEGORIES_MOCK[1];

export const USER_MOCK_1_CATEGORIES: Category[] = CATEGORIES_MOCK.filter(
  (category) => category.user.id === USER_MOCK.id
);

export const USER_MOCK_2_CATEGORIES: Category[] = CATEGORIES_MOCK.filter(
  (category) => category.user.id === USER_MOCK_2.id
);

export const CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  params: {
    categoryId: "1"
  }
} as CategoryAuthenticatedRequest;

export const MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: {
    categoriesIds: USER_MOCK_1_CATEGORIES.map((category) => category.id)
  }
} as ManyCategoriesAuthenticatedRequest;
