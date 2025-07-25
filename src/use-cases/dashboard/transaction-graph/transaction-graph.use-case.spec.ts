import { TransactionGraphUseCase } from "./transaction-graph.use-case";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";
import {
  TRANSACTION_GRAPH_DATA_MOCK,
  TRANSACTION_GRAPH_EMPTY_RETURN_MOCK,
  TRANSACTION_GRAPH_FILTERS,
  TRANSACTION_GRAPH_RETURN_MOCK
} from "@test/mocks/dashboard.mock";
import { USER_MOCK } from "@test/mocks/user.mock";

describe("TransactionGraphUseCase", () => {
  let sut: TransactionGraphUseCase;
  let transactionRepository: TransactionRepository;

  beforeEach(() => {
    transactionRepository = new TransactionRepositoryStub();
    sut = new TransactionGraphUseCase(transactionRepository);
  });

  it("should return transaction graph correctly", async () => {
    jest
      .spyOn(transactionRepository, "getTransactionGraphData")
      .mockResolvedValue(TRANSACTION_GRAPH_DATA_MOCK);

    const result = await sut.execute(USER_MOCK.id, TRANSACTION_GRAPH_FILTERS);

    testUtils.resultExpectations(result, TRANSACTION_GRAPH_RETURN_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.getTransactionGraphData,
      calledWith: {
        userId: USER_MOCK.id,
        TRANSACTION_GRAPH_FILTERS
      }
    });
  });

  it("should handle empty graph data", async () => {
    jest
      .spyOn(transactionRepository, "getTransactionGraphData")
      .mockResolvedValue([]);

    const result = await sut.execute(USER_MOCK.id, TRANSACTION_GRAPH_FILTERS);

    testUtils.resultExpectations(result, TRANSACTION_GRAPH_EMPTY_RETURN_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.getTransactionGraphData,
      calledWith: {
        userId: USER_MOCK.id,
        TRANSACTION_GRAPH_FILTERS
      }
    });
  });
});
