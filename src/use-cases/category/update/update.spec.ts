import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { UpdateCategoryUseCase } from "./update.use-case";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import {
  EXPENSE_CATEGORY_MOCK,
  INCOME_CATEGORY_MOCK
} from "@test/mocks/category.mock";
import { USER_MOCK } from "@test/mocks/user.mock";
import * as testUtils from "@test/utils/test-utils";

describe("UpdateCategoryUseCase", () => {
  let sut: UpdateCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new UpdateCategoryUseCase(
      categoryRepository,
      exceptionsAdapter,
      userRepository
    );
  });

  it("should be able to update a category", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(EXPENSE_CATEGORY_MOCK);
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");

    const result = await sut.execute(
      USER_MOCK.id,
      EXPENSE_CATEGORY_MOCK.id,
      EXPENSE_CATEGORY_MOCK
    );

    testUtils.resultExpectations(result, undefined);

    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);

    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: EXPENSE_CATEGORY_MOCK.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: USER_MOCK.id,
      times: 1
    });
  });

  it("should not be able to update a category that does not exist", async () => {
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(null);
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");

    const result = await sut.execute(
      USER_MOCK.id,
      EXPENSE_CATEGORY_MOCK.id,
      EXPENSE_CATEGORY_MOCK
    );

    testUtils.resultExpectations(result, undefined);

    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: USER_MOCK.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: EXPENSE_CATEGORY_MOCK.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: exceptionsAdapter.notFound,
      calledWith: { message: "Category not found" },
      times: 1
    });
  });

  it("should not be able to update another user's category", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(INCOME_CATEGORY_MOCK);
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");

    const result = await sut.execute(
      USER_MOCK.id,
      INCOME_CATEGORY_MOCK.id,
      INCOME_CATEGORY_MOCK
    );

    testUtils.resultExpectations(result, undefined);

    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: USER_MOCK.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: INCOME_CATEGORY_MOCK.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: { message: "You are not allowed to access this category" },
      times: 1
    });
  });
});
