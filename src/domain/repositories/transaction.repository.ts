import { Category } from "@domain/entities/category.entity";
import { Origin } from "@domain/entities/origin.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { Transaction } from "@domain/entities/transaction.entity";

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

export abstract class TransactionRepository {
  abstract findAll(userId: number): Promise<Transaction[] | null>;
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
