import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { FindAndValidateSubCategoryUseCase } from "./find-and-validate.use-case";
import { USER_MOCK } from "@test/mocks/user.mock";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import {
  BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  PARAM_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  QUERY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  USER_1_SUB_CATEGORIES_MOCK,
  USER_2_SUB_CATEGORIES_MOCK
} from "@test/mocks/sub-category.mock";

describe("FindAndValidateSubCategoryUseCase", () => {
  let sut: FindAndValidateSubCategoryUseCase;
  let subCategoryRepository: SubCategoryRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAndValidateSubCategoryUseCase(
      subCategoryRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
    jest.spyOn(sut, "isParamSubCategoryRequest");
    jest.spyOn(sut, "isQuerySubCategoriesRequest");
    jest.spyOn(sut, "isBodySubCategoriesRequest");
    jest.spyOn(sut, "handleParamSubCategoryRequest");
    jest.spyOn(sut, "handleQuerySubCategoriesRequest");
    jest.spyOn(sut, "handleBodySubCategoriesRequest");
    jest.spyOn(sut, "validateRequest");
  });

  it("should call handleParamSubCategoryRequest if the subCategoryId was passed as a param", async () => {
    jest
      .spyOn(subCategoryRepository, "findByIds")
      .mockResolvedValue([USER_1_SUB_CATEGORIES_MOCK[0]]);

    const response = await sut.execute(
      PARAM_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamSubCategoryRequest,
      calledWith: [PARAM_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: true
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQuerySubCategoriesRequest,
      calledWith: [PARAM_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodySubCategoriesRequest,
      calledWith: [PARAM_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleParamSubCategoryRequest,
      calledWith: [USER_MOCK.id, PARAM_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, [1]]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should call handleQuerySubCategoryRequest if the subCategoryId was passed as a query", async () => {
    jest
      .spyOn(subCategoryRepository, "findByIds")
      .mockResolvedValue(USER_1_SUB_CATEGORIES_MOCK);

    const response = await sut.execute(
      QUERY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamSubCategoryRequest,
      calledWith: [QUERY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQuerySubCategoriesRequest,
      calledWith: [QUERY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: true
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodySubCategoriesRequest,
      calledWith: [QUERY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleQuerySubCategoriesRequest,
      calledWith: [USER_MOCK.id, QUERY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, USER_1_SUB_CATEGORIES_MOCK.map((c) => c.id)]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should call handleBodySubCategoryRequest if the subCategoryId was passed in the body", async () => {
    jest
      .spyOn(subCategoryRepository, "findByIds")
      .mockResolvedValue(USER_1_SUB_CATEGORIES_MOCK);

    const response = await sut.execute(
      BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamSubCategoryRequest,
      calledWith: [BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQuerySubCategoriesRequest,
      calledWith: [BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: false
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodySubCategoriesRequest,
      calledWith: [BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK],
      returnedWith: true
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleBodySubCategoriesRequest,
      calledWith: [USER_MOCK.id, BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, USER_1_SUB_CATEGORIES_MOCK.map((c) => c.id)]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should return true if all subCategories are found and belong to the user", async () => {
    jest
      .spyOn(subCategoryRepository, "findByIds")
      .mockResolvedValue(USER_1_SUB_CATEGORIES_MOCK);

    const result = await sut.execute(
      BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, true);
    testUtils.resultExpectations(
      BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.subCategories,
      USER_1_SUB_CATEGORIES_MOCK
    );
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.findByIds,
      calledWith: [
        BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.subCategoriesIds
      ]
    });
  });

  it("should return false if all the subCategories weren't found", async () => {
    jest.spyOn(subCategoryRepository, "findByIds").mockResolvedValue(null);

    const result = await sut.execute(
      BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.findByIds,
      calledWith: [
        BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.subCategoriesIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [
        {
          message: "The sub-category(ies) was/were not found, please try again"
        }
      ]
    });
  });

  it("should return false if some subCategories are not found", async () => {
    jest
      .spyOn(subCategoryRepository, "findByIds")
      .mockResolvedValue([USER_1_SUB_CATEGORIES_MOCK[0]]);

    const result = await sut.execute(
      BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.findByIds,
      calledWith: [
        BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.subCategoriesIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [
        { message: "Some sub-categories were not found, please try again" }
      ]
    });
  });

  it("should return false if some subCategories do not belong to the user", async () => {
    jest
      .spyOn(subCategoryRepository, "findByIds")
      .mockResolvedValue(USER_2_SUB_CATEGORIES_MOCK);

    const result = await sut.execute(
      BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.findByIds,
      calledWith: [
        BODY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.subCategoriesIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [
        {
          message:
            "You are not allowed to access one or more of these sub-categories"
        }
      ]
    });
  });
});
