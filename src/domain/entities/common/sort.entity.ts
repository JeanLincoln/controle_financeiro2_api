export enum SortOrderEnum {
  ASC = "ASC",
  DESC = "DESC"
}

export interface SortOrderParam {
  sortOrder: SortOrderEnum;
}

export interface SortParams<T> extends SortOrderParam {
  sortBy: T;
}
