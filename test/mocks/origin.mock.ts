import { Origin } from "@domain/entities/origin.entity";
import { CreateOrUpdateAllOriginProps } from "@domain/repositories/origin.repository";
import { OriginAuthenticatedRequest } from "@use-cases/origin/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { USER_MOCK, USER_MOCK_2 } from "./user.mock";
import { OriginBodyAuthenticatedRequest } from "@use-cases/origin/find-and-validate-from-body/find-and-validate-from-body.use-case";
import {
  PaginationMeta,
  PaginatedResult
} from "@domain/entities/pagination.entity";

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

export const USER_1_PAGINATED_ORIGINS_MOCK: PaginatedResult<Origin> = {
  data: USER_1_ORIGINS_MOCK,
  meta: ORIGIN_PAGINATION_META_MOCK
};

export const USER_2_PAGINATED_ORIGINS_MOCK: PaginatedResult<Origin> = {
  data: USER_2_ORIGINS_MOCK,
  meta: ORIGIN_PAGINATION_META_MOCK
};

export const PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  params: {
    originId: "1"
  }
} as OriginAuthenticatedRequest;

export const BODY_ORIGIN_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: { originId: 1 }
} as OriginBodyAuthenticatedRequest;
