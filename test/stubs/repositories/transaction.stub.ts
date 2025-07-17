import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
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

  findAll(): Promise<RepositoryToPaginationReturn<Transaction>> {
    return Promise.resolve({ data: [], total: 0 });
  }

  findById(): Promise<Transaction | null> {
    return Promise.resolve(null);
  }

  findByIds(): Promise<Transaction[]> {
    return Promise.resolve([]);
  }
}
