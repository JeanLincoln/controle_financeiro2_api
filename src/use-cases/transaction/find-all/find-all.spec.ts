import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";
import { FindAllTransactionUseCase } from "./find-all.use-case";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import {
  TRANSACTIONS_PAGINATION_AND_SORT_PARAMS_MOCK,
  TRANSACTIONS_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK,
  USER_1_PAGINATED_TRANSACTIONS_MOCK,
  USER_1_TRANSACTIONS_MOCK
} from "@test/mocks/transaction.mock";
import { USER_MOCK } from "@test/mocks/user.mock";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";
import { PAGINATION_EMPTY_RESULT_MOCK } from "@test/mocks/pagination.mock";

describe("FindAllTransactionUseCase", () => {
  let sut: FindAllTransactionUseCase;
  let transactionsRepository: TransactionRepository;
  let exceptionsAdapter: ExceptionsAdapter;
  let paginationUseCase: PaginationUseCase;

  beforeEach(() => {
    transactionsRepository = new TransactionRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    paginationUseCase = new PaginationUseCase();
    sut = new FindAllTransactionUseCase(
      transactionsRepository,
      paginationUseCase
    );

    jest.spyOn(exceptionsAdapter, "internalServerError");
  });

  it("should find all transactions", async () => {
    jest.spyOn(transactionsRepository, "findAll").mockResolvedValue({
      data: USER_1_TRANSACTIONS_MOCK,
      total: USER_1_TRANSACTIONS_MOCK.length
    });

    const result = await sut.execute(
      USER_MOCK.id,
      TRANSACTIONS_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.notCalledExpectations([exceptionsAdapter.internalServerError]);
    testUtils.resultExpectations(result, USER_1_PAGINATED_TRANSACTIONS_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionsRepository.findAll,
      calledWith: [
        USER_MOCK.id,
        TRANSACTIONS_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK
      ]
    });
  });

  it("should return an empty array if no transactions are found", async () => {
    jest.spyOn(transactionsRepository, "findAll").mockResolvedValue({
      data: [],
      total: 0
    });

    const result = await sut.execute(
      USER_MOCK.id,
      TRANSACTIONS_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.notCalledExpectations([exceptionsAdapter.internalServerError]);
    testUtils.resultExpectations(result, PAGINATION_EMPTY_RESULT_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionsRepository.findAll,
      calledWith: [
        USER_MOCK.id,
        TRANSACTIONS_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK
      ]
    });
  });
});
