import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";
import { FindAllTransactionUseCase } from "./find-all.use-case";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { USER_1_TRANSACTIONS_MOCK } from "@test/mocks/transaction.mock";
import { USER_MOCK } from "@test/mocks/user.mock";

describe("FindAllTransactionUseCase", () => {
  let sut: FindAllTransactionUseCase;
  let transactionsRepository: TransactionRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    transactionsRepository = new TransactionRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAllTransactionUseCase(
      transactionsRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "internalServerError");
  });

  it("should find all transactions", async () => {
    jest
      .spyOn(transactionsRepository, "findAll")
      .mockResolvedValue(USER_1_TRANSACTIONS_MOCK);

    const result = await sut.execute(USER_MOCK.id);

    testUtils.notCalledExpectations([exceptionsAdapter.internalServerError]);
    testUtils.resultExpectations(result, USER_1_TRANSACTIONS_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionsRepository.findAll,
      calledWith: [USER_MOCK.id]
    });
  });

  it("should return an empty array if no transactions are found", async () => {
    jest.spyOn(transactionsRepository, "findAll").mockResolvedValue([]);

    const result = await sut.execute(USER_MOCK.id);

    testUtils.notCalledExpectations([exceptionsAdapter.internalServerError]);
    testUtils.resultExpectations(result, []);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionsRepository.findAll,
      calledWith: [USER_MOCK.id]
    });
  });
});
