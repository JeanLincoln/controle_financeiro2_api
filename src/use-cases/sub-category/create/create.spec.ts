import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CreateSubCategoryUseCase } from "./create.use-case";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import { CREATE_SUB_CATEGORY_MOCK } from "@test/mocks/sub-category.mock";
import { EXPENSE_CATEGORY_MOCK } from "@test/mocks/category.mock";
import { USER_MOCK, USER_MOCK_2 } from "@test/mocks/user.mock";
describe("CreateSubCategoryUseCase", () => {
  let sut: CreateSubCategoryUseCase;
  let subCategoryRepository: SubCategoryRepository;
  let exceptionAdapter: ExceptionsAdapter;
  let categoryRepository: CategoryRepository;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    exceptionAdapter = new ExceptionsAdapterStub();
    categoryRepository = new CategoryRepositoryStub();

    sut = new CreateSubCategoryUseCase(
      subCategoryRepository,
      exceptionAdapter,
      categoryRepository
    );

    jest.spyOn(exceptionAdapter, "notFound");
    jest.spyOn(exceptionAdapter, "forbidden");
  });
  it("should be able to create a new sub category based on a category", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(EXPENSE_CATEGORY_MOCK);
    jest.spyOn(subCategoryRepository, "create");

    const result = await sut.execute(USER_MOCK.id, CREATE_SUB_CATEGORY_MOCK);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      exceptionAdapter.notFound,
      exceptionAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: [EXPENSE_CATEGORY_MOCK.id],
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: subCategoryRepository.create,
      calledWith: [CREATE_SUB_CATEGORY_MOCK],
      times: 1
    });
  });

  it("should not be able to create a new sub category based on a non-existent category", async () => {
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(null);
    jest.spyOn(subCategoryRepository, "create");

    const result = await sut.execute(USER_MOCK.id, CREATE_SUB_CATEGORY_MOCK);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      subCategoryRepository.create,
      exceptionAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: [EXPENSE_CATEGORY_MOCK.id],
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: exceptionAdapter.notFound,
      calledWith: { payload: { message: "Category not found" } },
      times: 1
    });
  });

  it("should not be able to create a category for another user's category", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(EXPENSE_CATEGORY_MOCK);
    jest.spyOn(subCategoryRepository, "create");

    const result = await sut.execute(USER_MOCK_2.id, CREATE_SUB_CATEGORY_MOCK);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      subCategoryRepository.create,
      exceptionAdapter.notFound
    ]);
    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: [EXPENSE_CATEGORY_MOCK.id],
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: exceptionAdapter.forbidden,
      calledWith: {
        payload: { message: "You are not the owner of this category" }
      },
      times: 1
    });
  });
});
