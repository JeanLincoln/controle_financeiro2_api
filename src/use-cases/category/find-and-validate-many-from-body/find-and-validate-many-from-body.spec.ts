import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { FindAndValidateManyFromBodyCategoryUseCase } from "./find-and-validate-many-from-body.use-case";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import {
  MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  USER_1_CATEGORIES_MOCK,
  USER_2_CATEGORIES_MOCK
} from "@test/mocks/category.mock";

describe("FindAndValidateManyFromBodyCategoryUseCase", () => {
  let sut: FindAndValidateManyFromBodyCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAndValidateManyFromBodyCategoryUseCase(
      categoryRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should return true if all categories are found and belong to the user", async () => {
    jest
      .spyOn(categoryRepository, "findByIds")
      .mockResolvedValue(USER_1_CATEGORIES_MOCK);

    const result = await sut.execute(MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, true);
    testUtils.resultExpectations(
      MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK.categories,
      USER_1_CATEGORIES_MOCK
    );
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findByIds,
      calledWith: [MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.categoriesIds]
    });
  });

  it("should return false if all the categories weren't found", async () => {
    jest.spyOn(categoryRepository, "findByIds").mockResolvedValue(null);

    const result = await sut.execute(MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findByIds,
      calledWith: [MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.categoriesIds]
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

    const result = await sut.execute(MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findByIds,
      calledWith: [MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.categoriesIds]
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

    const result = await sut.execute(MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findByIds,
      calledWith: [MANY_CATEGORY_AUTHENTICATED_REQUEST_MOCK.body.categoriesIds]
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
