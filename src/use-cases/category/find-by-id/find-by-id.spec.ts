import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { FindByIdCategoryUseCase } from "./find-by-id.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { USER_MOCK } from "@test/mocks/user.mock";
import {
  EXPENSE_CATEGORY_MOCK,
  INCOME_CATEGORY_MOCK
} from "@test/mocks/category.mock";

describe("FindByIdCategoryUseCase", () => {
  let sut: FindByIdCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindByIdCategoryUseCase(
      exceptionsAdapter,
      categoryRepository,
      userRepository
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should be able to find a category by id", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(EXPENSE_CATEGORY_MOCK);

    const result = await sut.execute(USER_MOCK.id, EXPENSE_CATEGORY_MOCK.id);

    testUtils.resultExpectations(result, EXPENSE_CATEGORY_MOCK);

    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: { id: USER_MOCK.id },
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: { id: EXPENSE_CATEGORY_MOCK.id },
      times: 1
    });
  });

  it("should not be able to find a category by id if the user does not exist", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);
    jest.spyOn(categoryRepository, "findById");

    const result = await sut.execute(USER_MOCK.id, INCOME_CATEGORY_MOCK.id);

    testUtils.resultExpectations(result, undefined);

    testUtils.notCalledExpectations([
      exceptionsAdapter.forbidden,
      categoryRepository.findById
    ]);

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: { id: USER_MOCK.id },
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: exceptionsAdapter.notFound,
      calledWith: {
        payload: { message: "User not found" }
      },
      times: 1
    });
  });

  it("should not be able to find a category by id if the category does not exist", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(USER_MOCK.id, INCOME_CATEGORY_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: { id: USER_MOCK.id },
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: { id: INCOME_CATEGORY_MOCK.id },
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: exceptionsAdapter.notFound,
      calledWith: {
        payload: { message: "Category not found" }
      },
      times: 1
    });
  });

  it("should throw an error if the category belongs to another user", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(INCOME_CATEGORY_MOCK);

    const result = await sut.execute(USER_MOCK.id, INCOME_CATEGORY_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: { id: USER_MOCK.id },
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: { id: INCOME_CATEGORY_MOCK.id },
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: {
        payload: { message: "You are not allowed to access this category" }
      },
      times: 1
    });
  });
});
