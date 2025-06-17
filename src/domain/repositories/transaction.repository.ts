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
>;

export abstract class TransactionRepository {
  abstract findAll(): Promise<Transaction[]>;
  abstract findById(id: number): Promise<Transaction | null>;
  abstract create(
    userId: number,
    transaction: CreateOrUpdateAllTransactionProps
  ): Promise<void>;
  abstract update(
    userId: number,
    id: number,
    transaction: CreateOrUpdateAllTransactionProps
  ): Promise<void>;
  abstract partialUpdate(
    userId: number,
    id: number,
    transaction: Partial<CreateOrUpdateAllTransactionProps>
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
