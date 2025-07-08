import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { USER_1_TRANSACTIONS_MOCK } from "@test/mocks/transaction.mock";
import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";
import { DeleteTransactionUseCase } from "./delete.use-case";

describe("DeleteTransactionUseCase", () => {
  let sut: DeleteTransactionUseCase;
  let transactionRepository: TransactionRepository;

  beforeEach(() => {
    transactionRepository = new TransactionRepositoryStub();
    sut = new DeleteTransactionUseCase(transactionRepository);
  });

  it("should delete a transaction successfully", async () => {
    jest.spyOn(transactionRepository, "delete");

    const result = await sut.execute(USER_1_TRANSACTIONS_MOCK[0]);

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.delete,
      calledWith: [USER_1_TRANSACTIONS_MOCK[0]]
    });
  });
});
