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

export type TransactionFindAllToUseCase = CommonPaginationParams &
  SortParams<TransactionsSortableFieldsEnum>;

export type TransactionFindAllToRepositoryParams = RepositoryPaginationParams &
  SortParams<TransactionsSortableFieldsEnum>;

export abstract class TransactionRepository {
  abstract findAll(
    userId: number,
    repositoryParams: TransactionFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Transaction>>;
  abstract findById(id: number): Promise<Transaction | null>;
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
