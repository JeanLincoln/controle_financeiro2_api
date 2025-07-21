import { USER_MOCK, USER_MOCK_2 } from "./user.mock";
import {
  CreateOrUpdateAllTransactionProps,
  TransactionsSortableFieldsEnum
} from "@domain/repositories/transaction.repository";
import { ORIGIN_MOCK } from "./origin.mock";
import {
  Transaction,
  TransactionType
} from "@domain/entities/transaction.entity";
import {
  PaginatedResult,
  PaginationMeta
} from "@domain/entities/common/pagination.entity";
import {
  PAGINATION_PARAMS_MOCK,
  PAGINATION_TO_REPOSITORY_PARAMS_MOCK
} from "./pagination.mock";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import {
  BodyTransactionsAuthenticatedRequest,
  ParamTransactionAuthenticatedRequest,
  QueryTransactionAuthenticatedRequest
} from "@use-cases/transaction/find-and-validate/find-and-validate.use-case";

export const CREATE_OR_UPDATE_TRANSACTION_MOCK: CreateOrUpdateAllTransactionProps =
  {
    name: "Transaction",
    description: "Transaction description",
    amount: 100,
    startDate: new Date(),
    type: TransactionType.INCOME,
    endDate: null
  };

export const TRANSACTIONS_MOCK: Transaction[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    name: `Transaction ${index + 1}`,
    description: `Transaction description ${index + 1}`,
    type:
      (index + 1) % 2 === 0 ? TransactionType.INCOME : TransactionType.EXPENSE,
    amount: (index + 1) * 10,
    startDate: new Date(),
    endDate: null,
    categories: [],
    subCategories: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    origin: ORIGIN_MOCK,
    userId: index % 2 === 0 ? USER_MOCK.id : USER_MOCK_2.id,
    user: index % 2 === 0 ? USER_MOCK : USER_MOCK_2
  })
);

export const INCOME_TRANSACTIONS_MOCK: Transaction[] = TRANSACTIONS_MOCK.filter(
  (transaction) => transaction.type === TransactionType.INCOME
);

export const EXPENSE_TRANSACTIONS_MOCK: Transaction[] =
  TRANSACTIONS_MOCK.filter(
    (transaction) => transaction.type === TransactionType.EXPENSE
  );

export const USER_1_TRANSACTIONS_MOCK: Transaction[] = TRANSACTIONS_MOCK.filter(
  (transaction) => transaction.user.id === USER_MOCK.id
);
export const USER_2_TRANSACTIONS_MOCK: Transaction[] = TRANSACTIONS_MOCK.filter(
  (transaction) => transaction.user.id === USER_MOCK_2.id
);

const TRANSACTION_PAGINATION_META_MOCK: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 5,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
  firstPage: 1,
  lastPage: 1,
  from: 1,
  to: 5
};

export const TRANSACTIONS_SORT_MOCK = {
  sortBy: TransactionsSortableFieldsEnum.updatedAt,
  sortOrder: SortOrderEnum.DESC
};

export const TRANSACTIONS_PAGINATION_AND_SORT_PARAMS_MOCK = {
  ...PAGINATION_PARAMS_MOCK,
  ...TRANSACTIONS_SORT_MOCK
};

export const TRANSACTIONS_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK = {
  ...PAGINATION_TO_REPOSITORY_PARAMS_MOCK,
  ...TRANSACTIONS_SORT_MOCK
};

export const USER_1_PAGINATED_TRANSACTIONS_MOCK: PaginatedResult<Transaction> =
  {
    data: USER_1_TRANSACTIONS_MOCK,
    pagination: TRANSACTION_PAGINATION_META_MOCK
  };

export const USER_2_PAGINATED_TRANSACTIONS_MOCK: PaginatedResult<Transaction> =
  {
    data: USER_2_TRANSACTIONS_MOCK,
    pagination: TRANSACTION_PAGINATION_META_MOCK
  };

export const PARAM_TRANSACTION_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  params: {
    transactionId: "1"
  }
} as ParamTransactionAuthenticatedRequest;

export const QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  query: {
    transactionsIds: USER_1_TRANSACTIONS_MOCK.map((transaction) =>
      transaction.id.toString()
    )
  }
} as QueryTransactionAuthenticatedRequest;

export const BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: {
    transactionsIds: USER_1_TRANSACTIONS_MOCK.map(
      (transaction) => transaction.id
    )
  }
} as BodyTransactionsAuthenticatedRequest;

export const NO_CONTENT_TRANSACTION_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK
} as ParamTransactionAuthenticatedRequest;

export const EMPTY_QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  query: {
    transactionsIds: [] as string[]
  }
} as QueryTransactionAuthenticatedRequest;

export const EMPTY_BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: {
    transactionsIds: [] as number[]
  }
} as BodyTransactionsAuthenticatedRequest;
