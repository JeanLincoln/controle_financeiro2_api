import { Transaction } from "@domain/entities/transaction.entity";
import { TransactionRepository } from "@domain/repositories/transaction.repository";

export class TransactionRepositoryStub implements TransactionRepository {
  create(): Promise<void> {
    return Promise.resolve();
  }

  update(): Promise<void> {
    return Promise.resolve();
  }

  delete(): Promise<void> {
    return Promise.resolve();
  }

  findAll(): Promise<Transaction[]> {
    return Promise.resolve([]);
  }

  findById(): Promise<Transaction | null> {
    return Promise.resolve(null);
  }

  partialUpdate(): Promise<void> {
    return Promise.resolve();
  }
}
