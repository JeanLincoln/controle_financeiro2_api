import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { USER_1_CATEGORIES_MOCK } from "@test/mocks/category.mock";
import { ORIGIN_MOCK } from "@test/mocks/origin.mock";
import { USER_1_SUB_CATEGORIES_MOCK } from "@test/mocks/sub-category.mock";
import { USER_1_TRANSACTIONS_MOCK } from "@test/mocks/transaction.mock";
import { USER_MOCK } from "@test/mocks/user.mock";
import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";
import { UpdateTransactionUseCase } from "./update.use-case";

describe("Update Transaction Use Case", () => {
  let sut: UpdateTransactionUseCase;
  let transactionRepository: TransactionRepository;

  beforeEach(() => {
    transactionRepository = new TransactionRepositoryStub();
    sut = new UpdateTransactionUseCase(transactionRepository);
  });

  it("should update a transaction successfully", async () => {
    jest.spyOn(transactionRepository, "update");

    const result = await sut.execute(
      USER_1_TRANSACTIONS_MOCK[0],
      USER_MOCK.id,
      ORIGIN_MOCK,
      USER_1_CATEGORIES_MOCK,
      USER_1_SUB_CATEGORIES_MOCK,
      USER_1_TRANSACTIONS_MOCK[0]
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.update,
      calledWith: [
        USER_1_TRANSACTIONS_MOCK[0],
        USER_MOCK.id,
        ORIGIN_MOCK,
        USER_1_CATEGORIES_MOCK,
        USER_1_SUB_CATEGORIES_MOCK,
        USER_1_TRANSACTIONS_MOCK[0]
      ]
    });
  });
});
