import { Category } from "@domain/entities/category.entity";
import {
  RepositoryPaginationParams,
  RepositoryToPaginationReturn,
  CommonPaginationParams
} from "@domain/entities/common/pagination.entity";
import {
  SortParams,
  SortOrderParam
} from "@domain/entities/common/sort.entity";
import { User } from "@domain/entities/user.entity";

export type BaseCategory = Omit<
  Category,
  "transactions" | "user" | "subCategories"
>;

export type CreateOrUpdateAllCategoryProps = Omit<
  BaseCategory,
  "id" | "createdAt" | "updatedAt"
>;

export type CategoryOption = Pick<BaseCategory, "id" | "name">;

export enum CategoriesSortableFieldsEnum {
  name = "name",
  description = "description",
  type = "type",
  createdAt = "createdAt",
  updatedAt = "updatedAt"
}

export interface CategoriesSearchField {
  search?: string;
}

export type CategoryFindAllToUseCase = CommonPaginationParams &
  SortParams<CategoriesSortableFieldsEnum>;

export type CategoryFindAllToRepositoryParams = RepositoryPaginationParams &
  SortParams<CategoriesSortableFieldsEnum>;

export type CategoryOptionsToUseCaseParams = CommonPaginationParams &
  SortOrderParam &
  CategoriesSearchField;

export type CategoryFindOptionsToRepositoryParams = RepositoryPaginationParams &
  SortOrderParam &
  CategoriesSearchField;

export abstract class CategoryRepository {
  abstract findAll(
    userId: number,
    paginationParams: CategoryFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Category>>;
  abstract options(
    userId: number,
    paginationParams: CategoryFindOptionsToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<CategoryOption>>;
  abstract findById(id: number): Promise<Category | null>;
  abstract findByIds(ids: number[]): Promise<Category[] | null>;
  abstract create(
    user: User,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void>;
  abstract update(
    id: number,
    userId: number,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
  abstract deleteByUserId(userId: number): Promise<void>;
}
