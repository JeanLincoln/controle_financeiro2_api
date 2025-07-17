import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";
import { FindAndValidateTransactionUseCase } from "./find-and-validate.use-case";
import { USER_MOCK } from "@test/mocks/user.mock";
import {
  USER_1_TRANSACTIONS_MOCK,
  PARAM_TRANSACTION_AUTHENTICATED_REQUEST_MOCK,
  QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK,
  BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK,
  USER_2_TRANSACTIONS_MOCK,
  NO_CONTENT_TRANSACTION_AUTHENTICATED_REQUEST_MOCK,
  EMPTY_QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK,
  EMPTY_BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
} from "@test/mocks/transaction.mock";

describe("FindAndValidateTransactionUseCase", () => {
  let sut: FindAndValidateTransactionUseCase;
  let transactionRepository: TransactionRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    transactionRepository = new TransactionRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAndValidateTransactionUseCase(
      transactionRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
    jest.spyOn(sut, "isParamTransactionRequest");
    jest.spyOn(sut, "isQueryTransactionsRequest");
    jest.spyOn(sut, "isBodyTransactionsRequest");
    jest.spyOn(sut, "handleParamTransactionRequest");
    jest.spyOn(sut, "handleQueryTransactionsRequest");
    jest.spyOn(sut, "handleBodyTransactionsRequest");
    jest.spyOn(sut, "validateRequest");
  });

  it("should call handleParamTransactionRequest if the transactionId was passed as a param", async () => {
    jest
      .spyOn(transactionRepository, "findByIds")
      .mockResolvedValue([USER_1_TRANSACTIONS_MOCK[0]]);

    const response = await sut.execute(
      PARAM_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamTransactionRequest,
      calledWith: [PARAM_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: true
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQueryTransactionsRequest,
      calledWith: [PARAM_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodyTransactionsRequest,
      calledWith: [PARAM_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleParamTransactionRequest,
      calledWith: [USER_MOCK.id, PARAM_TRANSACTION_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, [1]]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should call handleQueryTransactionRequest if the transactionId was passed as a query", async () => {
    jest
      .spyOn(transactionRepository, "findByIds")
      .mockResolvedValue(USER_1_TRANSACTIONS_MOCK);

    const response = await sut.execute(
      QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamTransactionRequest,
      calledWith: [QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQueryTransactionsRequest,
      calledWith: [QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: true
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodyTransactionsRequest,
      calledWith: [QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleQueryTransactionsRequest,
      calledWith: [USER_MOCK.id, QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, USER_1_TRANSACTIONS_MOCK.map((c) => c.id)]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should call handleBodyTransactionRequest if the transactionId was passed in the body", async () => {
    jest
      .spyOn(transactionRepository, "findByIds")
      .mockResolvedValue(USER_1_TRANSACTIONS_MOCK);

    const response = await sut.execute(
      BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamTransactionRequest,
      calledWith: [BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQueryTransactionsRequest,
      calledWith: [BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodyTransactionsRequest,
      calledWith: [BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: true
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleBodyTransactionsRequest,
      calledWith: [USER_MOCK.id, BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, USER_1_TRANSACTIONS_MOCK.map((c) => c.id)]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should return true if the request does not contain any type of transactionId", async () => {
    const response = await sut.execute(
      NO_CONTENT_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamTransactionRequest,
      calledWith: [NO_CONTENT_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQueryTransactionsRequest,
      calledWith: [NO_CONTENT_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodyTransactionsRequest,
      calledWith: [NO_CONTENT_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.notCalledExpectations([
      sut.handleParamTransactionRequest,
      sut.handleQueryTransactionsRequest,
      sut.handleBodyTransactionsRequest,
      sut.validateRequest
    ]);
    testUtils.resultExpectations(response, true);
  });

  it("should return true and set an empty transactions array if the request contains an empty transactionsIds array in query request type", async () => {
    const result = await sut.execute(
      EMPTY_QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamTransactionRequest,
      calledWith: [EMPTY_QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQueryTransactionsRequest,
      calledWith: [EMPTY_QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: true
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodyTransactionsRequest,
      calledWith: [EMPTY_QUERY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.notCalledExpectations([
      sut.handleParamTransactionRequest,
      sut.handleBodyTransactionsRequest,
      sut.validateRequest
    ]);
    testUtils.resultExpectations(result, true);
  });

  it("should return true and set an empty transactions array if the request contains an empty transactionsIds array in body request type", async () => {
    const result = await sut.execute(
      EMPTY_BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamTransactionRequest,
      calledWith: [EMPTY_BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQueryTransactionsRequest,
      calledWith: [EMPTY_BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodyTransactionsRequest,
      calledWith: [EMPTY_BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: true
    });
    testUtils.notCalledExpectations([
      sut.handleParamTransactionRequest,
      sut.handleQueryTransactionsRequest,
      sut.validateRequest
    ]);
    testUtils.resultExpectations(result, true);
  });

  it("should return true if all transactions are found and belong to the user", async () => {
    jest
      .spyOn(transactionRepository, "findByIds")
      .mockResolvedValue(USER_1_TRANSACTIONS_MOCK);

    const result = await sut.execute(
      BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, true);
    testUtils.resultExpectations(
      BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK.transactions,
      USER_1_TRANSACTIONS_MOCK
    );
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.findByIds,
      calledWith: [
        BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK.body.transactionsIds
      ]
    });
  });

  it("should return false if all the transactions weren't found", async () => {
    jest.spyOn(transactionRepository, "findByIds").mockResolvedValue(null);

    const result = await sut.execute(
      BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.findByIds,
      calledWith: [
        BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK.body.transactionsIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [
        {
          message:
            "There was an error while fetching transactions, please try again"
        }
      ]
    });
  });

  it("should return false if some transactions are not found", async () => {
    jest
      .spyOn(transactionRepository, "findByIds")
      .mockResolvedValue([USER_1_TRANSACTIONS_MOCK[0]]);

    const result = await sut.execute(
      BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.findByIds,
      calledWith: [
        BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK.body.transactionsIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [
        { message: "Some transactions were not found, please try again" }
      ]
    });
  });

  it("should return false if some transactions do not belong to the user", async () => {
    jest
      .spyOn(transactionRepository, "findByIds")
      .mockResolvedValue(USER_2_TRANSACTIONS_MOCK);

    const result = await sut.execute(
      BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.findByIds,
      calledWith: [
        BODY_TRANSACTION_AUTHENTICATED_REQUEST_MOCK.body.transactionsIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [
        {
          message:
            "You are not allowed to access one or more of these transactions"
        }
      ]
    });
  });
});
