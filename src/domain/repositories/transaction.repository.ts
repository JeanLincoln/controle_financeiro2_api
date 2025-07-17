import { Category } from "@domain/entities/category.entity";
import { Origin } from "@domain/entities/origin.entity";
import {
  RepositoryToPaginationReturn,
  CommonPaginationParams,
  RepositoryPaginationParams
} from "@domain/entities/common/pagination.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { Transaction } from "@domain/entities/transaction.entity";
import { SortParams } from "@domain/entities/common/sort.entity";

export type CreateOrUpdateAllTransactionProps = Omit<
  Transaction,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "user"
  | "origin"
  | "categories"
  | "subCategories"
  | "userId"
>;

export type TransactionsFields = keyof Transaction;

export type TransactionsFieldsEnum = {
  [K in TransactionsFields]: K;
};

export enum TransactionsSortableFieldsEnum {
  name = "name",
  description = "description",
  amount = "amount",
  startDate = "startDate",
  isRecurring = "isRecurring",
  endDate = "endDate",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  originName = "origin.name"
}

export type TransactionFindAllFilters = {
  name?: string;
  description?: string;
  amount?: number;
  isRecurring?: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  originId?: number;
  categoriesIds?: number[];
  subCategoriesId?: number[];
};

export type TransactionFindAllToUseCase = CommonPaginationParams &
  SortParams<TransactionsSortableFieldsEnum> &
  TransactionFindAllFilters;

export type TransactionFindAllToRepositoryParams = RepositoryPaginationParams &
  SortParams<TransactionsSortableFieldsEnum> &
  TransactionFindAllFilters;

export abstract class TransactionRepository {
  abstract findAll(
    userId: number,
    queryParams: TransactionFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Transaction>>;
  abstract findById(id: number): Promise<Transaction | null>;
  abstract findByIds(id: number[]): Promise<Transaction[] | null>;
  abstract create(
    userId: number,
    origin: Origin,
    categories: Category[],
    subCategories: SubCategory[],
    transaction: CreateOrUpdateAllTransactionProps
  ): Promise<void>;
  abstract update(
    transactionToUpdate: Transaction,
    userId: number,
    origin: Origin,
    categories: Category[],
    subCategories: SubCategory[],
    updateData: CreateOrUpdateAllTransactionProps
  ): Promise<void>;
  abstract delete(transactionToDelete: Transaction): Promise<void>;
}
