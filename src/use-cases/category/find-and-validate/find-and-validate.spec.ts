import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import {
  BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  QUERY_CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  USER_1_CATEGORIES_MOCK,
  USER_2_CATEGORIES_MOCK
} from "@test/mocks/category.mock";
import { FindAndValidateCategoryUseCase } from "./find-and-validate.use-case";
import { USER_MOCK } from "@test/mocks/user.mock";

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
    jest.spyOn(sut, "isParamCategoryRequest");
    jest.spyOn(sut, "isQueryCategoriesRequest");
    jest.spyOn(sut, "isBodyCategoriesRequest");
    jest.spyOn(sut, "handleParamCategoryRequest");
    jest.spyOn(sut, "handleQueryCategoriesRequest");
    jest.spyOn(sut, "handleBodyCategoriesRequest");
    jest.spyOn(sut, "validateRequest");
  });

  it("should call handleParamCategoryRequest if the categoryId was passed as a param", async () => {
    jest
      .spyOn(categoryRepository, "findByIds")
      .mockResolvedValue([USER_1_CATEGORIES_MOCK[0]]);

    const response = await sut.execute(
      PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamCategoryRequest,
      calledWith: [PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleParamCategoryRequest,
      calledWith: [USER_MOCK.id, PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, [1]]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should call handleQueryCategoryRequest if the categoryId was passed as a query", async () => {
    jest
      .spyOn(categoryRepository, "findByIds")
      .mockResolvedValue(USER_1_CATEGORIES_MOCK);

    const response = await sut.execute(
      QUERY_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQueryCategoriesRequest,
      calledWith: [QUERY_CATEGORY_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleQueryCategoriesRequest,
      calledWith: [USER_MOCK.id, QUERY_CATEGORY_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, USER_1_CATEGORIES_MOCK.map((c) => c.id)]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should call handleBodyCategoryRequest if the categoryId was passed in the body", async () => {
    jest
      .spyOn(categoryRepository, "findByIds")
      .mockResolvedValue(USER_1_CATEGORIES_MOCK);

    const response = await sut.execute(
      BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodyCategoriesRequest,
      calledWith: [BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleBodyCategoriesRequest,
      calledWith: [USER_MOCK.id, BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, USER_1_CATEGORIES_MOCK.map((c) => c.id)]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should return true if all categories are found and belong to the user", async () => {
    jest
      .spyOn(categoryRepository, "findByIds")
      .mockResolvedValue(USER_1_CATEGORIES_MOCK);

    const result = await sut.execute(
      BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, true);
    testUtils.resultExpectations(
      BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK.categories,
      USER_1_CATEGORIES_MOCK
    );
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findByIds,
      calledWith: [
        BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.categoriesIds
      ]
    });
  });

  it("should return false if all the categories weren't found", async () => {
    jest.spyOn(categoryRepository, "findByIds").mockResolvedValue(null);

    const result = await sut.execute(
      BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findByIds,
      calledWith: [
        BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.categoriesIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [
        {
          message:
            "There was an error while fetching categories, please try again"
        }
      ]
    });
  });

  it("should return false if some categories are not found", async () => {
    jest
      .spyOn(categoryRepository, "findByIds")
      .mockResolvedValue([USER_1_CATEGORIES_MOCK[0]]);

    const result = await sut.execute(
      BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findByIds,
      calledWith: [
        BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.categoriesIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [
        { message: "Some categories were not found, please try again" }
      ]
    });
  });

  it("should return false if some categories do not belong to the user", async () => {
    jest
      .spyOn(categoryRepository, "findByIds")
      .mockResolvedValue(USER_2_CATEGORIES_MOCK);

    const result = await sut.execute(
      BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findByIds,
      calledWith: [
        BODY_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.categoriesIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [
        {
          message:
            "You are not allowed to access one or more of these categories"
        }
      ]
    });
  });
});
