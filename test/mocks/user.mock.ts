import {
  PaginationMeta,
  PaginatedResult
} from "@domain/entities/common/pagination.entity";
import { User } from "@domain/entities/user.entity";
import { BaseCreateOrUpdateUserProps } from "@domain/repositories/user.repository";

export const CREATE_OR_UPDATE_USER_PARAMS_MOCK: BaseCreateOrUpdateUserProps = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "123456",
  birthDate: new Date()
};

export const USERS_MOCK: User[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  firstName: `Test ${index + 1}`,
  lastName: `User ${index + 1}`,
  email: `test${index + 1}@test.com`,
  birthDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  password: "123456",
  transactions: [],
  origins: [],
  categories: []
}));

export const USER_MOCK: User = USERS_MOCK[0];

export const USER_MOCK_2: User = USERS_MOCK[1];

const USER_PAGINATION_META_MOCK: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 10,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
  firstPage: 1,
  lastPage: 1,
  from: 1,
  to: 10
};

export const USERS_PAGINATED_MOCK: PaginatedResult<User> = {
  data: USERS_MOCK,
  pagination: USER_PAGINATION_META_MOCK
};
