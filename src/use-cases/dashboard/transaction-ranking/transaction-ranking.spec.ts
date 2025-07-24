import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { TransactionRankingUseCase } from "./transaction-ranking.use-case";
import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";
import { USER_MOCK } from "@test/mocks/user.mock";

describe("TransactionRankingUseCase", () => {
  let sut: TransactionRankingUseCase;
  let transactionRepository: TransactionRepository;

  beforeEach(() => {
    transactionRepository = new TransactionRepositoryStub();
    sut = new TransactionRankingUseCase(transactionRepository);
  });

  it("should return transaction ranking for the current month", async () => {
    jest.spyOn(transactionRepository, "getCurrentMonthTopFiveTransactions");

    await sut.execute(USER_MOCK.id, undefined);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.getCurrentMonthTopFiveTransactions,
      calledWith: [USER_MOCK.id, undefined]
    });
  });
});
