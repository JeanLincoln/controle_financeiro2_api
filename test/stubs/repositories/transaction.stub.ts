import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
import { Transaction } from "@domain/entities/transaction.entity";
import {
  TransactionRepository,
  type CurrentBalance
} from "@domain/repositories/transaction.repository";

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

  getCurrentBalance(): Promise<CurrentBalance> {
    return Promise.resolve({
      currentMonth: {
        totalExpenses: 0,
        totalIncomes: 0,
        totalBalance: 0,
        totalTransactions: 0,
        totalRecurringTransactions: 0,
        totalNonRecurringTransactions: 0
      },
      lastMonth: {
        totalExpenses: 0,
        totalIncomes: 0,
        totalBalance: 0,
        totalTransactions: 0,
        totalRecurringTransactions: 0,
        totalNonRecurringTransactions: 0
      },
      variation: {
        expenses: {
          total: 0,
          percentage: 0
        },
        incomes: {
          total: 0,
          percentage: 0
        },
        balance: {
          total: 0,
          percentage: 0
        },
        transactions: 0,
        recurringTransactions: 0,
        nonRecurringTransactions: 0
      }
    });
  }
}
