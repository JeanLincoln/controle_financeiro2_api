import {
  TransactionRepository,
  type CurrentMonthTransactions,
  type LastMonthTransactions
} from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";

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

interface HandleCurrentAndLastVariationsProps {
  currentMonthTotalExpensesAmount: number;
  lastMonthTotalExpensesAmount: number;
  currentMonthTotalIncomesAmount: number;
  lastMonthTotalIncomesAmount: number;
}

type HandleCurrentBalanceProps = CurrentMonthTransactions &
  LastMonthTransactions;

@Injectable()
export class BalanceUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  private handleLastMonthTransactions({
    lastMonthExpenses,
    lastMonthIncomes
  }: LastMonthTransactions) {
    const lastMonthTotalExpensesAmount = lastMonthExpenses[0].reduce(
      (acc, transaction) => acc + Number(transaction.amount),
      0
    );

    const lastMonthTotalIncomesAmount = lastMonthIncomes[0].reduce(
      (acc, transaction) => acc + Number(transaction.amount),
      0
    );

    const lastMonthTotalBalance =
      lastMonthTotalIncomesAmount - lastMonthTotalExpensesAmount;
    const lastMonthTotalTransactions =
      lastMonthExpenses[1] + lastMonthIncomes[1];

    return {
      lastMonthTotalExpensesAmount,
      lastMonthTotalIncomesAmount,
      lastMonthTotalBalance,
      lastMonthTotalTransactions
    };
  }

  private handleCurrentMonthTransactions({
    currentMonthExpenses,
    currentMonthIncomes
  }: CurrentMonthTransactions) {
    const currentMonthTotalExpensesAmount = currentMonthExpenses[0].reduce(
      (acc, transaction) => acc + Number(transaction.amount),
      0
    );

    const currentMonthTotalIncomesAmount = currentMonthIncomes[0].reduce(
      (acc, transaction) => acc + Number(transaction.amount),
      0
    );

    const currentMonthTotalBalance =
      currentMonthTotalIncomesAmount - currentMonthTotalExpensesAmount;
    const currentMonthTotalTransactions =
      currentMonthExpenses[1] + currentMonthIncomes[1];

    return {
      currentMonthTotalExpensesAmount,
      currentMonthTotalIncomesAmount,
      currentMonthTotalBalance,
      currentMonthTotalTransactions
    };
  }

  private calculatePercentageVariation(
    current: number,
    previous: number
  ): number | null {
    const monthsHasNoTransactions = current === 0 && previous === 0;
    const infiniteGrowth = previous === 0 && current > 0;
    const totalDrop = previous > 0 && current === 0;

    if (monthsHasNoTransactions || infiniteGrowth || totalDrop) return null;

    const percentage = ((current - previous) / Math.abs(previous)) * 100;

    return Number(percentage.toFixed(2));
  }

  private handleCurrentAndLastVariations({
    currentMonthTotalExpensesAmount,
    currentMonthTotalIncomesAmount,
    lastMonthTotalExpensesAmount,
    lastMonthTotalIncomesAmount
  }: HandleCurrentAndLastVariationsProps) {
    const expensesVariation =
      currentMonthTotalExpensesAmount - lastMonthTotalExpensesAmount;
    const incomesVariation =
      currentMonthTotalIncomesAmount - lastMonthTotalIncomesAmount;

    const expensesPercentageVariation = this.calculatePercentageVariation(
      currentMonthTotalExpensesAmount,
      lastMonthTotalExpensesAmount
    );

    const incomesPercentageVariation = this.calculatePercentageVariation(
      currentMonthTotalIncomesAmount,
      lastMonthTotalIncomesAmount
    );

    const currentBalance =
      currentMonthTotalIncomesAmount - currentMonthTotalExpensesAmount;
    const lastBalance =
      lastMonthTotalIncomesAmount - lastMonthTotalExpensesAmount;

    const balanceVariation = currentBalance - lastBalance;

    const balancePercentageVariation = this.calculatePercentageVariation(
      currentBalance,
      lastBalance
    );

    return {
      expensesVariation,
      incomesVariation,
      balanceVariation,
      expensesPercentageVariation,
      incomesPercentageVariation,
      balancePercentageVariation
    };
  }

  private handleCurrentBalance({
    lastMonthExpenses,
    lastMonthIncomes,
    currentMonthExpenses,
    currentMonthIncomes
  }: HandleCurrentBalanceProps): CurrentBalance {
    const {
      lastMonthTotalTransactions,
      lastMonthTotalBalance,
      lastMonthTotalExpensesAmount,
      lastMonthTotalIncomesAmount
    } = this.handleLastMonthTransactions({
      lastMonthExpenses,
      lastMonthIncomes
    });

    const {
      currentMonthTotalTransactions,
      currentMonthTotalBalance,
      currentMonthTotalExpensesAmount,
      currentMonthTotalIncomesAmount
    } = this.handleCurrentMonthTransactions({
      currentMonthExpenses,
      currentMonthIncomes
    });

    const {
      incomesVariation,
      expensesVariation,
      balanceVariation,
      incomesPercentageVariation,
      expensesPercentageVariation,
      balancePercentageVariation
    } = this.handleCurrentAndLastVariations({
      currentMonthTotalExpensesAmount,
      currentMonthTotalIncomesAmount,
      lastMonthTotalExpensesAmount,
      lastMonthTotalIncomesAmount
    });

    return {
      lastMonth: {
        totalExpenses: lastMonthTotalExpensesAmount,
        totalIncomes: lastMonthTotalIncomesAmount,
        totalBalance: lastMonthTotalBalance,
        totalTransactions: lastMonthTotalTransactions
      },
      currentMonth: {
        totalExpenses: currentMonthTotalExpensesAmount,
        totalIncomes: currentMonthTotalIncomesAmount,
        totalBalance: currentMonthTotalBalance,
        totalTransactions: currentMonthTotalTransactions
      },
      variation: {
        expenses: {
          total: expensesVariation,
          percentage: expensesPercentageVariation
        },
        incomes: {
          total: incomesVariation,
          percentage: incomesPercentageVariation
        },
        balance: {
          total: balanceVariation,
          percentage: balancePercentageVariation
        }
      }
    };
  }

  async execute(userId: number): Promise<CurrentBalance> {
    const {
      currentMonthExpenses,
      currentMonthIncomes,
      lastMonthExpenses,
      lastMonthIncomes
    } = await this.transactionRepository.getCurrentBalance(userId);

    return this.handleCurrentBalance({
      currentMonthExpenses,
      currentMonthIncomes,
      lastMonthExpenses,
      lastMonthIncomes
    });
  }
}
