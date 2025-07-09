export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface RepositoryPaginationParams {
  skip: number;
  take: number;
}

export interface RepositoryToPaginationReturn<T> {
  data: T[];
  total: number;
}
