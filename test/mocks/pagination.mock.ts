import {
  PaginationMeta,
  PaginationParams,
  RepositoryPaginationParams
} from "@domain/entities/pagination.entity";

export const PAGINATION_PARAMS_MOCK: PaginationParams = {
  page: 1,
  limit: 10
};

export const PAGINATION_TO_REPOSITORY_PARAMS_MOCK: RepositoryPaginationParams =
  {
    skip: 0,
    take: 10
  };

export const PAGINATION_META_MOCK: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 100,
  totalPages: 10,
  hasNext: true,
  hasPrevious: false,
  firstPage: 1,
  lastPage: 1,
  from: 1,
  to: 10
};

export const EMPTY_PAGINATION_META_MOCK: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
  firstPage: 1,
  lastPage: 1,
  from: 0,
  to: 0
};

export const PAGINATION_EMPTY_RESULT_MOCK = {
  data: [],
  meta: EMPTY_PAGINATION_META_MOCK
};
