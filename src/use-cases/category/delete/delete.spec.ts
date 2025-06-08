import type { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import type { CategoryRepository } from "@domain/repositories/category.repository";
import type { UserRepository } from "@domain/repositories/user.repository";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { DeleteCategoryUseCase } from "./delete.use-case";
import {
  EXPENSE_CATEGORY_MOCK,
  INCOME_CATEGORY_MOCK
} from "@test/mocks/category.mock";
import { USER_MOCK } from "@test/mocks/user.mock";
import * as testUtils from "@test/utils/test-utils";

describe("DeleteCategoryUseCase", () => {
  let sut: DeleteCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new DeleteCategoryUseCase(
      categoryRepository,
      userRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should be able to delete a category", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(EXPENSE_CATEGORY_MOCK);
    jest.spyOn(categoryRepository, "delete");
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    const result = await sut.execute(USER_MOCK.id, EXPENSE_CATEGORY_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: [USER_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findById,
      calledWith: [EXPENSE_CATEGORY_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.delete,
      calledWith: [EXPENSE_CATEGORY_MOCK.id]
    });
  });

  it.todo("should delete all subcategories of a category");

  it("should not be able to delete a category that does not exist", async () => {
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(null);
    jest.spyOn(categoryRepository, "delete");
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    const result = await sut.execute(USER_MOCK.id, EXPENSE_CATEGORY_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      exceptionsAdapter.forbidden,
      categoryRepository.delete
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: [USER_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findById,
      calledWith: [EXPENSE_CATEGORY_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: {
        payload: { message: "Category not found" }
      }
    });
  });

  it("should not be able to delete a category of another user", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(INCOME_CATEGORY_MOCK);
    jest.spyOn(categoryRepository, "delete");
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    const result = await sut.execute(USER_MOCK.id, INCOME_CATEGORY_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      categoryRepository.delete
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: [USER_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findById,
      calledWith: [INCOME_CATEGORY_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: {
        payload: { message: "You are not allowed to delete this category" }
      }
    });
  });
});
