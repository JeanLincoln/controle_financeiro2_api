import {
  CommonPaginationParams,
  RepositoryPaginationParams,
  RepositoryToPaginationReturn
} from "@domain/entities/common/pagination.entity";
import { SortOrderParam } from "@domain/entities/common/sort.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { TransactionType } from "@domain/entities/transaction.entity";

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
  categoriesIds?: number[];
}

export type SubCategoryOptionsToUseCaseParams = CommonPaginationParams &
  SortOrderParam &
  SubCategoriesSearchField;

export type SubCategoriesFindOptionsToRepositoryParams =
  RepositoryPaginationParams & SortOrderParam & SubCategoriesSearchField;

interface RankedSubCategory
  extends Omit<BaseSubCategory, "createdAt" | "updatedAt"> {
  ranking: number;
  type: TransactionType;
  amount: number;
}

export type SubCategoryRanking = RankedSubCategory[];

export abstract class SubCategoryRepository {
  abstract findAllByCategory(categoryId: number): Promise<SubCategory[]>;
  abstract options(
    userId: number,
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
  abstract getCurrentMonthTopFiveSubCategories(
    userId: number,
    type?: TransactionType
  ): Promise<SubCategoryRanking>;
}
