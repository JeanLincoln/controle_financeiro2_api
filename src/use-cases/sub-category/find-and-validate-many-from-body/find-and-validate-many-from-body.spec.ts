import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { FindAndValidateManyFromBodySubCategoryUseCase } from "./find-and-validate-many-from-body.use-case";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import {
  MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  USER_MOCK_1_SUB_CATEGORIES,
  USER_MOCK_2_SUB_CATEGORIES
} from "@test/mocks/sub-category.mock";

describe("FindAndValidateManyFromBodySubCategoryUseCase", () => {
  let sut: FindAndValidateManyFromBodySubCategoryUseCase;
  let subSubCategoryRepository: SubCategoryRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    subSubCategoryRepository = new SubCategoryRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAndValidateManyFromBodySubCategoryUseCase(
      subSubCategoryRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should return true if all categories are found and belong to the user", async () => {
    jest
      .spyOn(subSubCategoryRepository, "findByIds")
      .mockResolvedValue(USER_MOCK_1_SUB_CATEGORIES);

    const result = await sut.execute(
      MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, true);
    testUtils.resultExpectations(
      MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.subCategories,
      USER_MOCK_1_SUB_CATEGORIES
    );
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subSubCategoryRepository.findByIds,
      calledWith: [
        MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.subCategoriesIds
      ]
    });
  });

  it("should return false if all the categories weren't found", async () => {
    jest.spyOn(subSubCategoryRepository, "findByIds").mockResolvedValue(null);

    const result = await sut.execute(
      MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subSubCategoryRepository.findByIds,
      calledWith: [
        MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.subCategoriesIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [
        {
          message:
            "There was an error while fetching sub categories, please try again"
        }
      ]
    });
  });

  it("should return false if some categories are not found", async () => {
    jest
      .spyOn(subSubCategoryRepository, "findByIds")
      .mockResolvedValue([USER_MOCK_1_SUB_CATEGORIES[0]]);

    const result = await sut.execute(
      MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subSubCategoryRepository.findByIds,
      calledWith: [
        MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.subCategoriesIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [
        { message: "Some sub categories were not found, please try again" }
      ]
    });
  });

  it("should return false if some categories do not belong to the user", async () => {
    jest
      .spyOn(subSubCategoryRepository, "findByIds")
      .mockResolvedValue(USER_MOCK_2_SUB_CATEGORIES);

    const result = await sut.execute(
      MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subSubCategoryRepository.findByIds,
      calledWith: [
        MANY_SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.subCategoriesIds
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [
        {
          message:
            "You are not allowed to access one or more of these sub categories"
        }
      ]
    });
  });
});
