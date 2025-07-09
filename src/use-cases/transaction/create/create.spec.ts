import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { CreateTransactionUseCase } from "./create.use-case";
import { TransactionRepositoryStub } from "@test/stubs/repositories/transaction.stub";
import { USER_MOCK } from "@test/mocks/user.mock";
import { ORIGIN_MOCK } from "@test/mocks/origin.mock";
import { USER_MOCK_1_SUB_CATEGORIES } from "@test/mocks/sub-category.mock";
import { USER_1_TRANSACTIONS_MOCK } from "@test/mocks/transaction.mock";
import { USER_1_CATEGORIES_MOCK } from "@test/mocks/category.mock";

describe("CreateTransactionUseCase", () => {
  let sut: CreateTransactionUseCase;
  let transactionRepository: TransactionRepository;

  beforeEach(() => {
    transactionRepository = new TransactionRepositoryStub();
    sut = new CreateTransactionUseCase(transactionRepository);
  });

  it("should be able to create a new transaction", async () => {
    jest.spyOn(transactionRepository, "create");

    const result = await sut.execute(
      USER_MOCK.id,
      ORIGIN_MOCK,
      USER_1_CATEGORIES_MOCK,
      USER_MOCK_1_SUB_CATEGORIES,
      USER_1_TRANSACTIONS_MOCK[0]
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: transactionRepository.create,
      calledWith: [
        USER_MOCK.id,
        ORIGIN_MOCK,
        USER_1_CATEGORIES_MOCK,
        USER_MOCK_1_SUB_CATEGORIES,
        USER_1_TRANSACTIONS_MOCK[0]
      ]
    });
  });
});
