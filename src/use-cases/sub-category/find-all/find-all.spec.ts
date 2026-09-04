import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import {
  SubCategoriesSortableFieldsEnum,
  SubCategoryRepository
} from "@domain/repositories/sub-category.repository";
import { USER_1_CATEGORIES_MOCK } from "@test/mocks/category.mock";
import { PAGINATION_EMPTY_RESULT_MOCK } from "@test/mocks/pagination.mock";
import { USER_1_SUB_CATEGORIES_MOCK } from "@test/mocks/sub-category.mock";
import { USER_MOCK } from "@test/mocks/user.mock";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";
import { FindAllSubCategoryUseCase } from "./find-all.use-case";

describe("FindAllSubCategoryUseCase", () => {
  let sut: FindAllSubCategoryUseCase;
  let subCategoryRepository: SubCategoryRepository;
  let exceptionAdapter: ExceptionsAdapter;
  let paginationUseCase: PaginationUseCase;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    exceptionAdapter = new ExceptionsAdapterStub();
    paginationUseCase = new PaginationUseCase();
    sut = new FindAllSubCategoryUseCase(
      subCategoryRepository,
      exceptionAdapter,
      paginationUseCase
    );

    jest.spyOn(exceptionAdapter, "notFound");
    jest.spyOn(exceptionAdapter, "internalServerError");
  });

  const SUB_CATEGORIES_PAGINATION_AND_SORT_PARAMS_MOCK = {
    page: 1,
    limit: 10,
    sortBy: SubCategoriesSortableFieldsEnum.name,
    sortOrder: SortOrderEnum.ASC,
    categoriesIds: USER_1_CATEGORIES_MOCK.map((category) => category.id),
    name: ""
  };

  const SUB_CATEGORIES_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK = {
    skip: 0,
    take: 10,
    sortBy: SubCategoriesSortableFieldsEnum.name,
    sortOrder: SortOrderEnum.ASC,
    categoriesIds: USER_1_CATEGORIES_MOCK.map((category) => category.id),
    name: ""
  };

  it("should be able to find all sub-categories of a user", async () => {
    jest.spyOn(subCategoryRepository, "findAll").mockResolvedValue({
      data: USER_1_SUB_CATEGORIES_MOCK,
      total: USER_1_SUB_CATEGORIES_MOCK.length
    });

    const result = await sut.execute(
      USER_MOCK.id,
      SUB_CATEGORIES_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.notCalledExpectations([exceptionAdapter.notFound]);
    testUtils.resultExpectations(result?.data, USER_1_SUB_CATEGORIES_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.findAll,
      calledWith: [
        USER_MOCK.id,
        SUB_CATEGORIES_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK
      ]
    });
  });

  it("should return an empty array if the user has no sub-categories", async () => {
    jest
      .spyOn(subCategoryRepository, "findAll")
      .mockResolvedValue({ data: [], total: 0 });

    const result = await sut.execute(
      USER_MOCK.id,
      SUB_CATEGORIES_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.notCalledExpectations([exceptionAdapter.notFound]);
    testUtils.resultExpectations(result, PAGINATION_EMPTY_RESULT_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.findAll,
      calledWith: [
        USER_MOCK.id,
        SUB_CATEGORIES_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK
      ]
    });
  });

  it("should return notFound when repository fails to fetch sub-categories", async () => {
    jest
      .spyOn(subCategoryRepository, "findAll")
      .mockRejectedValue(new Error("mock error!"));

    const result = await sut.execute(
      USER_MOCK.id,
      SUB_CATEGORIES_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionAdapter.internalServerError,
      calledWith: [
        { message: "Something went wrong while fetching sub-categories" }
      ]
    });
  });
});
