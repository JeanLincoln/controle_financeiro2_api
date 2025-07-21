import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { USER_MOCK } from "@test/mocks/user.mock";
import { BalanceUseCase } from "./balance.use-case";
import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";

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

    expect(transactionRepository.getCurrentBalance).toHaveBeenCalledWith(
      USER_MOCK.id
    );
  });
});
