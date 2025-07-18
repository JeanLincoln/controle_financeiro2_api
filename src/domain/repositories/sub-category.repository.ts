import {
  CommonPaginationParams,
  RepositoryPaginationParams,
  RepositoryToPaginationReturn
} from "@domain/entities/common/pagination.entity";
import { SortOrderParam } from "@domain/entities/common/sort.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";

export type BaseSubCategory = Omit<
  SubCategory,
  "category" | "transactions" | "categoryId"
>;

export type CreateOrUpdateAllSubCategoryProps = Omit<
  BaseSubCategory,
  "id" | "createdAt" | "updatedAt"
>;

export type SubCategoryOption = Pick<SubCategory, "id" | "name">;

export interface SubCategoriesSearchField {
  search?: string;
}

export type SubCategoryOptionsToUseCaseParams = CommonPaginationParams &
  SortOrderParam &
  SubCategoriesSearchField;

export type SubCategoriesFindOptionsToRepositoryParams =
  RepositoryPaginationParams & SortOrderParam & SubCategoriesSearchField;

export abstract class SubCategoryRepository {
  abstract findAllByCategory(categoryId: number): Promise<SubCategory[]>;
  abstract options(
    userId: number,
    categoryId: number,
    paginationParams: SubCategoriesFindOptionsToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<SubCategoryOption>>;
  abstract findById(id: number): Promise<SubCategory | null>;
  abstract findByIds(id: number[]): Promise<SubCategory[] | null>;
  abstract create(
    categoryId: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void>;
  abstract update(
    id: number,
    categoryId: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
