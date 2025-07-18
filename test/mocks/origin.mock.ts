import { Origin } from "@domain/entities/origin.entity";
import {
  CreateOrUpdateAllOriginProps,
  OriginsSortableFieldsEnum
} from "@domain/repositories/origin.repository";
import { USER_MOCK, USER_MOCK_2 } from "./user.mock";
import {
  PaginationMeta,
  PaginatedResult
} from "@domain/entities/common/pagination.entity";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import {
  PAGINATION_PARAMS_MOCK,
  PAGINATION_TO_REPOSITORY_PARAMS_MOCK
} from "./pagination.mock";
import {
  BodyOriginAuthenticatedRequest,
  ParamOriginAuthenticatedRequest,
  QueryOriginAuthenticatedRequest
} from "@use-cases/origin/find-and-validate/find-and-validate.use-case";

export const CREATE_OR_UPDATE_ORIGIN_MOCK: CreateOrUpdateAllOriginProps = {
  name: "Origin",
  description: "Origin description",
  color: "#FF0000",
  icon: "test-icon"
};

export const ORIGINS_MOCK: Origin[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    name: `Origin ${index + 1}`,
    description: `Origin ${index + 1} description`,
    color: "#FF0000",
    icon: "test-icon",
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: [],
    user: (index + 1) % 2 === 0 ? USER_MOCK_2 : USER_MOCK
  })
);

export const ORIGIN_MOCK: Origin = ORIGINS_MOCK[0];

export const ORIGIN_MOCK_2: Origin = ORIGINS_MOCK[1];

export const USER_1_ORIGINS_MOCK: Origin[] = ORIGINS_MOCK.filter(
  (origin) => origin.user.id === USER_MOCK.id
);

export const USER_2_ORIGINS_MOCK: Origin[] = ORIGINS_MOCK.filter(
  (origin) => origin.user.id === USER_MOCK_2.id
);

const ORIGIN_PAGINATION_META_MOCK: PaginationMeta = {
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

export const ORIGINS_SORT_MOCK = {
  sortBy: OriginsSortableFieldsEnum.updatedAt,
  sortOrder: SortOrderEnum.DESC
};

export const ORIGINS_PAGINATION_AND_SORT_PARAMS_MOCK = {
  ...PAGINATION_PARAMS_MOCK,
  ...ORIGINS_SORT_MOCK
};

export const ORIGINS_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK = {
  ...PAGINATION_TO_REPOSITORY_PARAMS_MOCK,
  ...ORIGINS_SORT_MOCK
};

export const USER_1_PAGINATED_ORIGINS_MOCK: PaginatedResult<Origin> = {
  data: USER_1_ORIGINS_MOCK,
  pagination: ORIGIN_PAGINATION_META_MOCK
};

export const USER_2_PAGINATED_ORIGINS_MOCK: PaginatedResult<Origin> = {
  data: USER_2_ORIGINS_MOCK,
  pagination: ORIGIN_PAGINATION_META_MOCK
};

export const PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  params: {
    originId: "1"
  }
} as ParamOriginAuthenticatedRequest;

export const QUERY_ORIGIN_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  query: {
    originId: "1"
  }
} as QueryOriginAuthenticatedRequest;

export const BODY_ORIGIN_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: { originId: 1 }
} as BodyOriginAuthenticatedRequest;

export const NO_CONTENT_ORIGIN_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK
} as ParamOriginAuthenticatedRequest;
