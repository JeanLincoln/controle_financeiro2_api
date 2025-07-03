import { USER_MOCK, USER_MOCK_2 } from "./user.mock";
import { CreateOrUpdateAllTransactionProps } from "@domain/repositories/transaction.repository";
import { ORIGIN_MOCK } from "./origin.mock";
import { Transaction } from "@domain/entities/transaction.entity";

export const CREATE_OR_UPDATE_TRANSACTION_MOCK: CreateOrUpdateAllTransactionProps =
  {
    name: "Transaction",
    description: "Transaction description",
    amount: 100,
    startDate: new Date(),
    endDate: null,
    isRecurring: false
  };

export const TRANSACTIONS_MOCK: Transaction[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    name: `Transaction ${index + 1}`,
    description: `Transaction description ${index + 1}`,
    amount: (index + 1) * 10,
    startDate: new Date(),
    endDate: null,
    isRecurring: index % 2 === 0,
    categories: [],
    subCategories: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    origin: ORIGIN_MOCK,
    userId: index % 2 === 0 ? USER_MOCK.id : USER_MOCK_2.id,
    user: index % 2 === 0 ? USER_MOCK : USER_MOCK_2
  })
);

export const TRANSACTION_MOCK_1: Transaction = TRANSACTIONS_MOCK[0];
export const TRANSACTION_MOCK_2: Transaction = TRANSACTIONS_MOCK[1];
