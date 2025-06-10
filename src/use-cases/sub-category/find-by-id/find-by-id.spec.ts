import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { FindSubCategoryByIdUseCase } from "./find-by-id.use-case";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { SUB_CATEGORY_MOCK_1 } from "@test/mocks/sub-category.mock";
import {
  EXPENSE_CATEGORY_MOCK,
  INCOME_CATEGORY_MOCK
} from "@test/mocks/category.mock";
import { USER_MOCK } from "@test/mocks/user.mock";

describe("FindSubCategoryByIdUseCase", () => {
  let sut: FindSubCategoryByIdUseCase;
  let subCategoryRepository: SubCategoryRepository;
  let categoryRepository: CategoryRepository;
  let exceptionAdapter: ExceptionsAdapter;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    categoryRepository = new CategoryRepositoryStub();
    exceptionAdapter = new ExceptionsAdapterStub();

    sut = new FindSubCategoryByIdUseCase(
      subCategoryRepository,
      exceptionAdapter,
      categoryRepository
    );

    jest.spyOn(exceptionAdapter, "notFound");
    jest.spyOn(exceptionAdapter, "forbidden");
  });

  it("should be able to find a sub-category by id", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(EXPENSE_CATEGORY_MOCK);
    jest
      .spyOn(subCategoryRepository, "findById")
      .mockResolvedValue(SUB_CATEGORY_MOCK_1);

    const result = await sut.execute(USER_MOCK.id, SUB_CATEGORY_MOCK_1.id);

    testUtils.resultExpectations(result, SUB_CATEGORY_MOCK_1);
    testUtils.notCalledExpectations([
      exceptionAdapter.notFound,
      exceptionAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      times: 1,
      calledWith: {
        id: SUB_CATEGORY_MOCK_1.categoryId
      }
    });
    testUtils.timesCalledExpectations({
      mockFunction: subCategoryRepository.findById,
      times: 1,
      calledWith: {
        id: SUB_CATEGORY_MOCK_1.id
      }
    });
  });

  it("should not be able to find another user's sub-category", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(INCOME_CATEGORY_MOCK);
    jest
      .spyOn(subCategoryRepository, "findById")
      .mockResolvedValue(SUB_CATEGORY_MOCK_1);

    const result = await sut.execute(USER_MOCK.id, SUB_CATEGORY_MOCK_1.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionAdapter.notFound]);
    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      times: 1,
      calledWith: {
        id: SUB_CATEGORY_MOCK_1.categoryId
      }
    });
    testUtils.timesCalledExpectations({
      mockFunction: subCategoryRepository.findById,
      times: 1,
      calledWith: {
        id: SUB_CATEGORY_MOCK_1.id
      }
    });
    testUtils.timesCalledExpectations({
      mockFunction: exceptionAdapter.forbidden,
      times: 1,
      calledWith: {
        payload: {
          message: "You are not allowed to access this sub-category"
        }
      }
    });
  });

  it("should not be able to find a non-existent sub-category", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(INCOME_CATEGORY_MOCK);
    jest.spyOn(subCategoryRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(USER_MOCK.id, SUB_CATEGORY_MOCK_1.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      exceptionAdapter.forbidden,
      categoryRepository.findById
    ]);
    testUtils.timesCalledExpectations({
      mockFunction: subCategoryRepository.findById,
      times: 1,
      calledWith: {
        id: SUB_CATEGORY_MOCK_1.id
      }
    });
    testUtils.timesCalledExpectations({
      mockFunction: exceptionAdapter.notFound,
      times: 1,
      calledWith: {
        payload: {
          message: "Sub-category not found"
        }
      }
    });
  });

  it("should not be able to find a sub-category of a non-existent category", async () => {
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(null);
    jest
      .spyOn(subCategoryRepository, "findById")
      .mockResolvedValue(SUB_CATEGORY_MOCK_1);

    const result = await sut.execute(USER_MOCK.id, SUB_CATEGORY_MOCK_1.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      mockFunction: subCategoryRepository.findById,
      times: 1,
      calledWith: {
        id: SUB_CATEGORY_MOCK_1.id
      }
    });
    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      times: 1,
      calledWith: {
        id: SUB_CATEGORY_MOCK_1.categoryId
      }
    });
    testUtils.timesCalledExpectations({
      mockFunction: exceptionAdapter.notFound,
      times: 1,
      calledWith: {
        payload: {
          message: "Category not found"
        }
      }
    });
  });
});
