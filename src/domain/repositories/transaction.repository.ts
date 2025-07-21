import { Category } from "@domain/entities/category.entity";
import { Origin } from "@domain/entities/origin.entity";
import {
  RepositoryToPaginationReturn,
  CommonPaginationParams,
  RepositoryPaginationParams
} from "@domain/entities/common/pagination.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";
import {
  Transaction,
  TransactionType
} from "@domain/entities/transaction.entity";
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
  type = "type",
  amount = "amount",
  startDate = "startDate",
  endDate = "endDate",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  originName = "origin.name"
}

export type TransactionFindAllFilters = {
  name?: string;
  description?: string;
  type?: TransactionType;
  amount?: number;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  originId?: number;
  categoriesIds?: number[];
  subCategoriesIds?: number[];
};

export type TransactionFindAllToUseCase = CommonPaginationParams &
  SortParams<TransactionsSortableFieldsEnum> &
  TransactionFindAllFilters;

export type TransactionFindAllToRepositoryParams = RepositoryPaginationParams &
  SortParams<TransactionsSortableFieldsEnum> &
  TransactionFindAllFilters;

export interface CurrentBalance {
  currentMonth: {
    totalExpenses: number;
    totalIncomes: number;
    totalBalance: number;
    totalTransactions: number;
  };
  lastMonth: {
    totalExpenses: number;
    totalIncomes: number;
    totalBalance: number;
    totalTransactions: number;
  };
  variation: {
    expenses: {
      total: number;
      percentage: number | null;
    };
    incomes: {
      total: number;
      percentage: number | null;
    };
    balance: {
      total: number;
      percentage: number | null;
    };
  };
}

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
  abstract getCurrentBalance(userId: number): Promise<CurrentBalance>;
}
