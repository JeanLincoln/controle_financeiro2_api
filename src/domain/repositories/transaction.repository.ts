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

export type BaseTransaction = Omit<
  Transaction,
  "user" | "origin" | "categories" | "subCategories" | "userId"
>;

export type CreateOrUpdateAllTransactionProps = Omit<
  BaseTransaction,
  "id" | "createdAt" | "updatedAt"
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
  transactionDate = "transactionDate",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  originName = "origin.name"
}

export type TransactionFindAllFilters = {
  name?: string;
  description?: string;
  type?: TransactionType;
  amount?: number;
  transactionDate?: Date;
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

export type TransactionFindAndCount = [Transaction[], number];

export interface CurrentMonthTransactions {
  currentMonthExpenses: TransactionFindAndCount;
  currentMonthIncomes: TransactionFindAndCount;
}

export interface LastMonthTransactions {
  lastMonthExpenses: TransactionFindAndCount;
  lastMonthIncomes: TransactionFindAndCount;
}

interface RankedTransaction
  extends Omit<BaseTransaction, "createdAt" | "updatedAt"> {
  ranking: number;
  amount: number;
}

export type TransactionRanking = RankedTransaction[];

export interface TransactionGraphDataPoint {
  date: string;
  type: TransactionType;
  totalAmount: number;
  transactionCount: number;
}

export interface TransactionGraphFilters {
  startDate: Date;
  endDate: Date;
  type?: TransactionType;
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
  abstract getCurrentBalance(
    userId: number
  ): Promise<CurrentMonthTransactions & LastMonthTransactions>;
  abstract getCurrentMonthTopFiveTransactions(
    userId: number,
    type?: TransactionType
  ): Promise<TransactionRanking>;
  abstract getTransactionGraphData(
    userId: number,
    filters: TransactionGraphFilters
  ): Promise<TransactionGraphDataPoint[]>;
}
