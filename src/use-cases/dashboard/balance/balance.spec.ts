import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { USER_MOCK } from "@test/mocks/user.mock";
import { BalanceUseCase } from "./balance.use-case";
import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";
import * as dashBoardMocks from "@test/mocks/dashboard.mock";

describe("BalanceUseCase", () => {
  let sut: BalanceUseCase;
  let transactionRepository: TransactionRepository;

  beforeEach(() => {
    transactionRepository = new TransactionRepositoryStub();
    sut = new BalanceUseCase(transactionRepository);
  });

  it("should return the current balance for a user", async () => {
    jest.spyOn(transactionRepository, "getCurrentBalance");

    await sut.execute(USER_MOCK.id);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.getCurrentBalance,
      calledWith: [USER_MOCK.id]
    });
  });

  describe("Percentage variations with division by zero scenarios", () => {
    it("should return null when both current and previous values are zero", async () => {
      jest
        .spyOn(transactionRepository, "getCurrentBalance")
        .mockResolvedValue(dashBoardMocks.EMPTY_INCOMES_AND_EXPENSES_MOCK);

      const result = await sut.execute(USER_MOCK.id);

      testUtils.resultExpectations(result, dashBoardMocks.EMPTY_BALANCE_MOCK);
      testUtils.timesCalledExpectations({
        times: 1,
        mockFunction: transactionRepository.getCurrentBalance,
        calledWith: [USER_MOCK.id]
      });
    });

    it("should return null when previous value is zero and current is greater than zero (infinite growth)", async () => {
      jest
        .spyOn(transactionRepository, "getCurrentBalance")
        .mockResolvedValue(dashBoardMocks.ONLY_CURRENT_MONTH_TRANSACTIONS_MOCK);

      const result = await sut.execute(USER_MOCK.id);

      testUtils.resultExpectations(
        result,
        dashBoardMocks.ONLY_CURRENT_MONTH_BALANCE_MOCK
      );
      testUtils.timesCalledExpectations({
        times: 1,
        mockFunction: transactionRepository.getCurrentBalance,
        calledWith: [USER_MOCK.id]
      });
    });

    it("should return null when previous value is greater than zero and current is zero (total drop)", async () => {
      jest
        .spyOn(transactionRepository, "getCurrentBalance")
        .mockResolvedValue(dashBoardMocks.ONLY_LAST_MONTH_TRANSACTIONS_MOCK);

      const result = await sut.execute(USER_MOCK.id);

      testUtils.resultExpectations(
        result,
        dashBoardMocks.ONLY_LAST_MONTH_BALANCE_MOCK
      );
      testUtils.timesCalledExpectations({
        times: 1,
        mockFunction: transactionRepository.getCurrentBalance,
        calledWith: [USER_MOCK.id]
      });
    });

    it("should calculate normal percentage when both values are greater than zero", async () => {
      jest
        .spyOn(transactionRepository, "getCurrentBalance")
        .mockResolvedValue(dashBoardMocks.NORMAL_TRANSACTIONS_MOCK);

      const result = await sut.execute(USER_MOCK.id);

      testUtils.resultExpectations(result, dashBoardMocks.NORMAL_BALANCE_MOCK);
      testUtils.timesCalledExpectations({
        times: 1,
        mockFunction: transactionRepository.getCurrentBalance,
        calledWith: [USER_MOCK.id]
      });
    });

    it("should handle balance percentage correctly with mixed scenarios", async () => {
      jest
        .spyOn(transactionRepository, "getCurrentBalance")
        .mockResolvedValue(dashBoardMocks.MIXED_TRANSACTIONS_MOCK);

      const result = await sut.execute(USER_MOCK.id);

      testUtils.resultExpectations(result, dashBoardMocks.MIXED_BALANCE_MOCK);
      testUtils.timesCalledExpectations({
        times: 1,
        mockFunction: transactionRepository.getCurrentBalance,
        calledWith: [USER_MOCK.id]
      });
    });
  });
});
