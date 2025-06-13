import { Transaction } from "@domain/entities/transaction.entity";

export interface CreateOrUpdateAllTransactionProps
  extends Omit<
    Transaction,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "user"
    | "origin"
    | "categories"
    | "subCategories"
  > {
  userId: number;
  originId: number;
}

export abstract class TransactionRepository {
  abstract findAll(): Promise<Transaction[]>;
  abstract findById(id: number): Promise<Transaction | null>;
  abstract create(
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
