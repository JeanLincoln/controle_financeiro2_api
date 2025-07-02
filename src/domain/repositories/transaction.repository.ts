import type { Category } from "@domain/entities/category.entity";
import type { Origin } from "@domain/entities/origin.entity";
import type { SubCategory } from "@domain/entities/sub-category.entity";
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
  abstract findAll(userId: number): Promise<Transaction[]>;
  abstract findById(id: number): Promise<Transaction | null>;
  abstract create(
    userId: number,
    origin: Origin,
    categories: Category[],
    subCategories: SubCategory[],
    transaction: CreateOrUpdateAllTransactionProps
  ): Promise<void>;
  abstract update(
    id: number,
    transaction: CreateOrUpdateAllTransactionProps
  ): Promise<void>;
  abstract partialUpdate(
    id: number,
    transaction: Partial<CreateOrUpdateAllTransactionProps>
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
