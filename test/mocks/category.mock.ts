import { Category } from "@domain/entities/category.entity";
import { USER_MOCK, USER_MOCK_2 } from "./user.mock";
import {
  CategoriesSortableFieldsEnum,
  CreateOrUpdateAllCategoryProps,
  CategoryOption
} from "@domain/repositories/category.repository";
import {
  PaginatedResult,
  PaginationMeta
} from "@domain/entities/common/pagination.entity";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import {
  PAGINATION_PARAMS_MOCK,
  PAGINATION_TO_REPOSITORY_PARAMS_MOCK
} from "./pagination.mock";
import {
  ParamCategoryAuthenticatedRequest,
  BodyCategoriesAuthenticatedRequest,
  QueryCategoryAuthenticatedRequest
} from "@use-cases/category/find-and-validate/find-and-validate.use-case";

export const CREATE_OR_UPDATE_CATEGORY_MOCK: CreateOrUpdateAllCategoryProps = {
  name: "Category",
  description: "Category description",
  color: "#FF0000",
  icon: "test-icon"
};

export const CATEGORIES_MOCK: Category[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    name: `Category ${index + 1}`,
    description: `Category ${index + 1} description`,
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

export const CATEGORIES_OPTIONS_MOCK: CategoryOption[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: index + 1,
    name: `Category ${index + 1}`
  })
);

export const USER_1_CATEGORIES_MOCK: Category[] = CATEGORIES_MOCK.filter(
  (category) => category.user.id === USER_MOCK.id
);

export const USER_2_CATEGORIES_MOCK: Category[] = CATEGORIES_MOCK.filter(
  (category) => category.user.id === USER_MOCK_2.id
);

const CATEGORY_PAGINATION_META_MOCK: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 5,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
  firstPage: 1,
  lastPage: 1,
  from: 1,
  to: 5
};

export const CATEGORIES_SORT_MOCK = {
  sortBy: CategoriesSortableFieldsEnum.updatedAt,
  sortOrder: SortOrderEnum.DESC
};

export const CATEGORIES_PAGINATION_AND_SORT_PARAMS_MOCK = {
  ...PAGINATION_PARAMS_MOCK,
  ...CATEGORIES_SORT_MOCK
};

export const CATEGORIES_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK = {
  ...PAGINATION_TO_REPOSITORY_PARAMS_MOCK,
  ...CATEGORIES_SORT_MOCK
};

export const PAGINATED_CATEGORIES_OPTIONS_MOCK: PaginatedResult<CategoryOption> =
  {
    data: CATEGORIES_OPTIONS_MOCK,
    pagination: CATEGORY_PAGINATION_META_MOCK
  };

export const USER_1_PAGINATED_CATEGORIES_MOCK: PaginatedResult<Category> = {
  data: USER_1_CATEGORIES_MOCK,
  pagination: CATEGORY_PAGINATION_META_MOCK
};

export const USER_2_PAGINATED_CATEGORIES_MOCK: PaginatedResult<Category> = {
  data: USER_2_CATEGORIES_MOCK,
  pagination: CATEGORY_PAGINATION_META_MOCK
};

export const PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  params: {
    categoryId: "1"
  }
} as ParamCategoryAuthenticatedRequest;

export const QUERY_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  query: {
    categoriesIds: USER_1_CATEGORIES_MOCK.map((category) =>
      category.id.toString()
    )
  }
} as QueryCategoryAuthenticatedRequest;

export const BODY_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: {
    categoriesIds: USER_1_CATEGORIES_MOCK.map((category) => category.id)
  }
} as BodyCategoriesAuthenticatedRequest;

export const NO_CONTENT_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK
} as ParamCategoryAuthenticatedRequest;

export const EMPTY_QUERY_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  query: {
    categoriesIds: [] as string[]
  }
} as QueryCategoryAuthenticatedRequest;

export const EMPTY_BODY_CATEGORY_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: {
    categoriesIds: [] as number[]
  }
} as BodyCategoriesAuthenticatedRequest;
