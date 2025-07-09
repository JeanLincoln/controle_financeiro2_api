import type {
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
  hasPrevious: false
};

export const EMPTY_PAGINATION_META_MOCK: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false
};
