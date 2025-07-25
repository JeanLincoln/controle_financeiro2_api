import {
  CurrentMonthTransactions,
  LastMonthTransactions
} from "@domain/repositories/transaction.repository";
import { CurrentBalance } from "@use-cases/dashboard/balance/balance.use-case";
import { USER_1_TRANSACTIONS_MOCK } from "./transaction.mock";
import { TransactionType } from "@domain/entities/transaction.entity";
import { handleDateDiff } from "../../src/utils/get-last-and-current-dates/get-last-and-current-dates";

export const EMPTY_INCOMES_AND_EXPENSES_MOCK: CurrentMonthTransactions &
  LastMonthTransactions = {
  currentMonthExpenses: [[], 0],
  currentMonthIncomes: [[], 0],
  lastMonthExpenses: [[], 0],
  lastMonthIncomes: [[], 0]
};

export const EMPTY_BALANCE_MOCK: CurrentBalance = {
  currentMonth: {
    totalExpenses: 0,
    totalIncomes: 0,
    totalBalance: 0,
    totalTransactions: 0
  },
  lastMonth: {
    totalExpenses: 0,
    totalIncomes: 0,
    totalBalance: 0,
    totalTransactions: 0
  },
  variation: {
    expenses: {
      total: 0,
      percentage: null
    },
    incomes: {
      total: 0,
      percentage: null
    },
    balance: {
      total: 0,
      percentage: null
    }
  }
};

export const ONLY_CURRENT_MONTH_TRANSACTIONS_MOCK: CurrentMonthTransactions &
  LastMonthTransactions = {
  ...EMPTY_INCOMES_AND_EXPENSES_MOCK,
  currentMonthExpenses: [
    [
      {
        ...USER_1_TRANSACTIONS_MOCK[0],
        type: TransactionType.EXPENSE,
        amount: 100
      }
    ],
    1
  ],
  currentMonthIncomes: [
    [
      {
        ...USER_1_TRANSACTIONS_MOCK[0],
        type: TransactionType.INCOME,
        amount: 200
      }
    ],
    1
  ]
};

export const ONLY_CURRENT_MONTH_BALANCE_MOCK: CurrentBalance = {
  ...EMPTY_BALANCE_MOCK,
  currentMonth: {
    totalExpenses: 100,
    totalIncomes: 200,
    totalBalance: 100,
    totalTransactions: 2
  },
  variation: {
    expenses: {
      total: 100,
      percentage: null
    },
    incomes: {
      total: 200,
      percentage: null
    },
    balance: {
      total: 100,
      percentage: null
    }
  }
};

export const ONLY_LAST_MONTH_TRANSACTIONS_MOCK: CurrentMonthTransactions &
  LastMonthTransactions = {
  ...EMPTY_INCOMES_AND_EXPENSES_MOCK,
  lastMonthExpenses: [
    [
      {
        ...USER_1_TRANSACTIONS_MOCK[0],
        type: TransactionType.EXPENSE,
        amount: 100
      }
    ],
    1
  ],
  lastMonthIncomes: [
    [
      {
        ...USER_1_TRANSACTIONS_MOCK[0],
        type: TransactionType.INCOME,
        amount: 200
      }
    ],
    1
  ]
};

export const ONLY_LAST_MONTH_BALANCE_MOCK: CurrentBalance = {
  ...EMPTY_BALANCE_MOCK,
  lastMonth: {
    totalExpenses: 100,
    totalIncomes: 200,
    totalBalance: 100,
    totalTransactions: 2
  },
  variation: {
    expenses: {
      total: -100,
      percentage: null
    },
    incomes: {
      total: -200,
      percentage: null
    },
    balance: {
      total: -100,
      percentage: null
    }
  }
};

export const NORMAL_TRANSACTIONS_MOCK: CurrentMonthTransactions &
  LastMonthTransactions = {
  currentMonthExpenses:
    ONLY_CURRENT_MONTH_TRANSACTIONS_MOCK.currentMonthExpenses,
  currentMonthIncomes: ONLY_CURRENT_MONTH_TRANSACTIONS_MOCK.currentMonthIncomes,
  lastMonthExpenses: ONLY_LAST_MONTH_TRANSACTIONS_MOCK.lastMonthExpenses,
  lastMonthIncomes: ONLY_LAST_MONTH_TRANSACTIONS_MOCK.lastMonthIncomes
};

export const NORMAL_BALANCE_MOCK: CurrentBalance = {
  ...ONLY_CURRENT_MONTH_BALANCE_MOCK,
  ...ONLY_LAST_MONTH_BALANCE_MOCK,
  currentMonth: {
    ...ONLY_CURRENT_MONTH_BALANCE_MOCK.currentMonth,
    totalBalance: 100,
    totalExpenses: 100,
    totalIncomes: 200,
    totalTransactions: 2
  },
  lastMonth: {
    ...ONLY_LAST_MONTH_BALANCE_MOCK.lastMonth,
    totalBalance: 100,
    totalExpenses: 100,
    totalIncomes: 200,
    totalTransactions: 2
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
    }
  }
};

export const MIXED_TRANSACTIONS_MOCK: CurrentMonthTransactions &
  LastMonthTransactions = {
  currentMonthExpenses: [
    [
      {
        ...USER_1_TRANSACTIONS_MOCK[0],
        type: TransactionType.EXPENSE,
        amount: 50
      }
    ],
    1
  ],
  currentMonthIncomes: [
    [
      {
        ...USER_1_TRANSACTIONS_MOCK[0],
        type: TransactionType.INCOME,
        amount: 0
      }
    ],
    1
  ],
  lastMonthExpenses: [
    [
      {
        ...USER_1_TRANSACTIONS_MOCK[0],
        type: TransactionType.EXPENSE,
        amount: 100
      }
    ],
    1
  ],
  lastMonthIncomes: [
    [
      {
        ...USER_1_TRANSACTIONS_MOCK[0],
        type: TransactionType.INCOME,
        amount: 200
      }
    ],
    1
  ]
};

export const MIXED_BALANCE_MOCK: CurrentBalance = {
  currentMonth: {
    totalExpenses: 50,
    totalIncomes: 0,
    totalBalance: -50,
    totalTransactions: 2
  },
  lastMonth: {
    totalExpenses: 100,
    totalIncomes: 200,
    totalBalance: 100,
    totalTransactions: 2
  },
  variation: {
    expenses: {
      total: -50,
      percentage: -50
    },
    incomes: {
      total: -200,
      percentage: null
    },
    balance: {
      total: -150,
      percentage: -150
    }
  }
};

export const CreateFormattedMockDate = (
  date: Date,
  hours = 0,
  minutes = 0,
  seconds = 0
) => {
  const formattedDate = new Date(date);
  formattedDate.setHours(hours, minutes, seconds);
  return handleDateDiff(formattedDate);
};

export const TRANSACTION_GRAPH_FILTERS = {
  startDate: CreateFormattedMockDate(new Date(2025, 0, 1)),
  endDate: CreateFormattedMockDate(new Date(2025, 0, 1), 23, 59, 59),
  type: TransactionType.EXPENSE
};

export const TRANSACTION_GRAPH_DATA_MOCK = [
  {
    date: "2025-01-01",
    type: TransactionType.EXPENSE,
    totalAmount: 100.5,
    transactionCount: 2
  },
  {
    date: "2025-01-02",
    type: TransactionType.EXPENSE,
    totalAmount: 200.75,
    transactionCount: 3
  }
];

export const TRANSACTION_GRAPH_RETURN_MOCK = {
  data: TRANSACTION_GRAPH_DATA_MOCK,
  summary: {
    totalAmount: 301.25,
    totalTransactions: 5,
    averagePerDay: 150.63
  }
};

export const TRANSACTION_GRAPH_EMPTY_RETURN_MOCK = {
  data: [],
  summary: {
    totalAmount: 0,
    totalTransactions: 0,
    averagePerDay: 0
  }
};
