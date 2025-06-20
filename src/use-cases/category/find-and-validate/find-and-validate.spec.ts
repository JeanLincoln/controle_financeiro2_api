import { FindAndValidateCategoryUseCase } from "./find-and-validate.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import {
  CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  EXPENSE_CATEGORY_MOCK,
  INCOME_CATEGORY_MOCK
} from "@test/mocks/category.mock";

describe("FindAndValidateCategoryUseCase", () => {
  let sut: FindAndValidateCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAndValidateCategoryUseCase(
      categoryRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should return true and set the category in the request if all validations pass", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(EXPENSE_CATEGORY_MOCK);

    const result = await sut.execute(CATEGORY_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, true);
    testUtils.resultExpectations(
      CATEGORY_AUTHENTICATED_REQUEST_MOCK.category,
      EXPENSE_CATEGORY_MOCK
    );
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findById,
      calledWith: [EXPENSE_CATEGORY_MOCK.id]
    });
  });

  it("should return false if the category is not found", async () => {
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(CATEGORY_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findById,
      calledWith: [EXPENSE_CATEGORY_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [{ message: "Category not found" }]
    });
  });

  it("should return false if the category is not owned by the user", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(INCOME_CATEGORY_MOCK);

    const result = await sut.execute(CATEGORY_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [{ message: "You are not allowed to access this category" }]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findById,
      calledWith: [
        Number(CATEGORY_AUTHENTICATED_REQUEST_MOCK.params.categoryId)
      ]
    });
  });
});
