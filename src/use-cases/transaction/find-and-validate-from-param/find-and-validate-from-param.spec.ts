import { FindAndValidateFromParamTransactionUseCase } from "./find-and-validate-from-param.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";
import {
  TRANSACTION_AUTHENTICATED_REQUEST_MOCK,
  USER_1_TRANSACTIONS_MOCK,
  USER_2_TRANSACTIONS_MOCK
} from "@test/mocks/transaction.mock";

describe("FindAndValidateFromParamTransactionUseCase", () => {
  let sut: FindAndValidateFromParamTransactionUseCase;
  let transactionRepository: TransactionRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    transactionRepository = new TransactionRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAndValidateFromParamTransactionUseCase(
      transactionRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should return true and set the transaction in the request if all validations pass", async () => {
    jest
      .spyOn(transactionRepository, "findById")
      .mockResolvedValue(USER_1_TRANSACTIONS_MOCK[0]);

    const result = await sut.execute(TRANSACTION_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, true);
    testUtils.resultExpectations(
      TRANSACTION_AUTHENTICATED_REQUEST_MOCK.transaction,
      USER_1_TRANSACTIONS_MOCK[0]
    );
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.findById,
      calledWith: [USER_1_TRANSACTIONS_MOCK[0].id]
    });
  });

  it("should return false if the transaction is not found", async () => {
    jest.spyOn(transactionRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(TRANSACTION_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.findById,
      calledWith: [USER_1_TRANSACTIONS_MOCK[0].id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [{ message: "Transaction not found" }]
    });
  });

  it("should return false if the transaction is not owned by the user", async () => {
    jest
      .spyOn(transactionRepository, "findById")
      .mockResolvedValue(USER_2_TRANSACTIONS_MOCK[0]);

    const result = await sut.execute(TRANSACTION_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [
        { message: "You are not allowed to access this transaction" }
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.findById,
      calledWith: [TRANSACTION_AUTHENTICATED_REQUEST_MOCK.params.transactionId]
    });
  });
});
