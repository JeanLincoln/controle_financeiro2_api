import type { Transaction } from "@domain/entities/transaction.entity";
import type { CurrentBalance } from "@domain/repositories/transaction.repository";

type TransactionFindAndCount = [Transaction[], number];

interface CurrentMonthTransactions {
  currentMonthExpenses: TransactionFindAndCount;
  currentMonthIncomes: TransactionFindAndCount;
}

interface LastMonthTransactions {
  lastMonthExpenses: TransactionFindAndCount;
  lastMonthIncomes: TransactionFindAndCount;
}

interface HandleCurrentAndLastVariationsProps {
  currentMonthTotalExpensesAmount: number;
  lastMonthTotalExpensesAmount: number;
  currentMonthTotalIncomesAmount: number;
  lastMonthTotalIncomesAmount: number;
}

interface HandleMonthsCountsProps {
  currentMonthTotalExpensesTransactions: number;
  currentMonthTotalIncomesTransactions: number;
  currentMonthTotalRecurringTransactions: number;
  currentMonthTotalNonRecurringTransactions: number;
  lastMonthTotalExpensesTransactions: number;
  lastMonthTotalIncomesTransactions: number;
  lastMonthTotalRecurringTransactions: number;
  lastMonthTotalNonRecurringTransactions: number;
}

type HandleCurrentBalanceProps = CurrentMonthTransactions &
  LastMonthTransactions & {
    currentMonthNonRecurringTransactions: number;
    currentMonthRecurringTransactions: number;
    lastMonthNonRecurringTransactions: number;
    lastMonthRecurringTransactions: number;
  };

export const handleLastMonthTransactions = ({
  lastMonthExpenses,
  lastMonthIncomes
}: LastMonthTransactions) => {
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
  const lastMonthTotalTransactions = lastMonthExpenses[1] + lastMonthIncomes[1];

  return {
    lastMonthTotalExpensesAmount,
    lastMonthTotalIncomesAmount,
    lastMonthTotalBalance,
    lastMonthTotalTransactions
  };
};

export const handleCurrentMonthTransactions = ({
  currentMonthExpenses,
  currentMonthIncomes
}: CurrentMonthTransactions) => {
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
};

const calculatePercentageVariation = (
  current: number,
  previous: number
): number | null => {
  const monthsHasNoTransactions = current === 0 && previous === 0;
  const infiniteGrowth = previous === 0 && current > 0;
  const totalDrop = previous > 0 && current === 0;

  if (monthsHasNoTransactions || infiniteGrowth || totalDrop) return null;

  return ((current - previous) / Math.abs(previous)) * 100;
};

export const handleCurrentAndLastVariations = ({
  currentMonthTotalExpensesAmount,
  currentMonthTotalIncomesAmount,
  lastMonthTotalExpensesAmount,
  lastMonthTotalIncomesAmount
}: HandleCurrentAndLastVariationsProps) => {
  const expensesVariation =
    currentMonthTotalExpensesAmount - lastMonthTotalExpensesAmount;
  const incomesVariation =
    currentMonthTotalIncomesAmount - lastMonthTotalIncomesAmount;

  const expensesPercentageVariation = calculatePercentageVariation(
    currentMonthTotalExpensesAmount,
    lastMonthTotalExpensesAmount
  );

  const incomesPercentageVariation = calculatePercentageVariation(
    currentMonthTotalIncomesAmount,
    lastMonthTotalIncomesAmount
  );

  const currentBalance =
    currentMonthTotalIncomesAmount - currentMonthTotalExpensesAmount;
  const lastBalance =
    lastMonthTotalIncomesAmount - lastMonthTotalExpensesAmount;

  const balanceVariation = currentBalance - lastBalance;

  const balancePercentageVariation = calculatePercentageVariation(
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
};

export const handleMonthsCounts = ({
  currentMonthTotalExpensesTransactions,
  currentMonthTotalIncomesTransactions,
  currentMonthTotalRecurringTransactions,
  currentMonthTotalNonRecurringTransactions,
  lastMonthTotalExpensesTransactions,
  lastMonthTotalIncomesTransactions,
  lastMonthTotalRecurringTransactions,
  lastMonthTotalNonRecurringTransactions
}: HandleMonthsCountsProps) => {
  const totalTransactions =
    currentMonthTotalExpensesTransactions +
    currentMonthTotalIncomesTransactions -
    (lastMonthTotalExpensesTransactions + lastMonthTotalIncomesTransactions);

  const recurringTransactions =
    currentMonthTotalRecurringTransactions -
    lastMonthTotalRecurringTransactions;
  const nonRecurringTransactions =
    currentMonthTotalNonRecurringTransactions -
    lastMonthTotalNonRecurringTransactions;

  return {
    totalTransactions,
    recurringTransactions,
    nonRecurringTransactions
  };
};

export const handleCurrentBalance = ({
  lastMonthExpenses,
  lastMonthIncomes,
  currentMonthExpenses,
  currentMonthIncomes,
  currentMonthNonRecurringTransactions,
  currentMonthRecurringTransactions,
  lastMonthNonRecurringTransactions,
  lastMonthRecurringTransactions
}: HandleCurrentBalanceProps): CurrentBalance => {
  const {
    lastMonthTotalTransactions,
    lastMonthTotalBalance,
    lastMonthTotalExpensesAmount,
    lastMonthTotalIncomesAmount
  } = handleLastMonthTransactions({
    lastMonthExpenses,
    lastMonthIncomes
  });

  const {
    currentMonthTotalTransactions,
    currentMonthTotalBalance,
    currentMonthTotalExpensesAmount,
    currentMonthTotalIncomesAmount
  } = handleCurrentMonthTransactions({
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
  } = handleCurrentAndLastVariations({
    currentMonthTotalExpensesAmount,
    currentMonthTotalIncomesAmount,
    lastMonthTotalExpensesAmount,
    lastMonthTotalIncomesAmount
  });

  const { nonRecurringTransactions, recurringTransactions, totalTransactions } =
    handleMonthsCounts({
      currentMonthTotalExpensesTransactions: currentMonthExpenses[1],
      currentMonthTotalIncomesTransactions: currentMonthIncomes[1],
      currentMonthTotalNonRecurringTransactions:
        currentMonthNonRecurringTransactions,
      currentMonthTotalRecurringTransactions: currentMonthRecurringTransactions,
      lastMonthTotalExpensesTransactions: lastMonthExpenses[1],
      lastMonthTotalIncomesTransactions: lastMonthIncomes[1],
      lastMonthTotalNonRecurringTransactions: lastMonthNonRecurringTransactions,
      lastMonthTotalRecurringTransactions: lastMonthRecurringTransactions
    });

  return {
    lastMonth: {
      totalExpenses: lastMonthTotalExpensesAmount,
      totalIncomes: lastMonthTotalIncomesAmount,
      totalBalance: lastMonthTotalBalance,
      totalTransactions: lastMonthTotalTransactions,
      totalRecurringTransactions: lastMonthRecurringTransactions,
      totalNonRecurringTransactions: lastMonthNonRecurringTransactions
    },
    currentMonth: {
      totalExpenses: currentMonthTotalExpensesAmount,
      totalIncomes: currentMonthTotalIncomesAmount,
      totalBalance: currentMonthTotalBalance,
      totalTransactions: currentMonthTotalTransactions,
      totalRecurringTransactions: currentMonthRecurringTransactions,
      totalNonRecurringTransactions: currentMonthNonRecurringTransactions
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
      },
      transactions: totalTransactions,
      recurringTransactions,
      nonRecurringTransactions
    }
  };
};
