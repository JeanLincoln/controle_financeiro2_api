export enum SortOrderEnum {
  ASC = "ASC",
  DESC = "DESC"
}

export interface SortParams<T> {
  sortOrder: SortOrderEnum;
  sortBy: T;
}
