import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CreateSubCategoryUseCase } from "./create.use-case";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import { CREATE_SUB_CATEGORY_MOCK } from "@test/mocks/sub-category.mock";
import {
  CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  EXPENSE_CATEGORY_MOCK
} from "@test/mocks/category.mock";
import { FindAndValidateFromParamCategoryUseCase } from "@use-cases/category/find-and-validate-from-param/find-and-validate-from-param.use-case";

describe("CreateSubCategoryUseCase", () => {
  let sut: CreateSubCategoryUseCase;
  let subCategoryRepository: SubCategoryRepository;
  let exceptionAdapter: ExceptionsAdapter;
  let categoryRepository: CategoryRepository;
  let findAndValidateCategoryUseCase: FindAndValidateFromParamCategoryUseCase;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    exceptionAdapter = new ExceptionsAdapterStub();
    categoryRepository = new CategoryRepositoryStub();

    findAndValidateCategoryUseCase =
      new FindAndValidateFromParamCategoryUseCase(
        categoryRepository,
        exceptionAdapter
      );

    sut = new CreateSubCategoryUseCase(
      subCategoryRepository,
      findAndValidateCategoryUseCase
    );

    jest.spyOn(exceptionAdapter, "notFound");
    jest.spyOn(exceptionAdapter, "forbidden");
  });

  it("should be able to create a new sub category based on a category", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(EXPENSE_CATEGORY_MOCK);
    jest.spyOn(subCategoryRepository, "create");

    const result = await sut.execute(
      CATEGORY_AUTHENTICATED_REQUEST_MOCK,
      CREATE_SUB_CATEGORY_MOCK
    );

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
      calledWith: [EXPENSE_CATEGORY_MOCK.id, CREATE_SUB_CATEGORY_MOCK],
      times: 1
    });
  });
});
