import { Category } from "@domain/entities/category.entity";
import {
  RepositoryPaginationParams,
  RepositoryToPaginationReturn,
  type CommonPaginationParams
} from "@domain/entities/common/pagination.entity";
import { SortParams } from "@domain/entities/common/sort.entity";
import { User } from "@domain/entities/user.entity";

export type CreateOrUpdateAllCategoryProps = Omit<
  Category,
  "id" | "createdAt" | "updatedAt" | "subCategories" | "user" | "transactions"
>;

export enum CategoriesSortableFieldsEnum {
  name = "name",
  description = "description",
  type = "type",
  createdAt = "createdAt",
  updatedAt = "updatedAt"
}

export type CategoryFindAllToUseCase = CommonPaginationParams &
  SortParams<CategoriesSortableFieldsEnum>;

export type CategoryFindAllToRepositoryParams = RepositoryPaginationParams &
  SortParams<CategoriesSortableFieldsEnum>;

export abstract class CategoryRepository {
  abstract findAll(
    userId: number,
    paginationParams: CategoryFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Category>>;
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
