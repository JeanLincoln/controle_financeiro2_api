import { CategoryRepository } from "@domain/repositories/category.repository";
import { FindAllCategoryUseCase } from "./find-all.use-case";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import {
  CATEGORIES_PAGINATION_AND_SORT_PARAMS_MOCK,
  CATEGORIES_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK,
  USER_1_CATEGORIES_MOCK,
  USER_1_PAGINATED_CATEGORIES_MOCK
} from "@test/mocks/category.mock";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";
import { PAGINATION_EMPTY_RESULT_MOCK } from "@test/mocks/pagination.mock";
import { USER_MOCK } from "@test/mocks/user.mock";

describe("FindAllCategoryUseCase", () => {
  let sut: FindAllCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let paginationUseCase: PaginationUseCase;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    paginationUseCase = new PaginationUseCase();
    sut = new FindAllCategoryUseCase(categoryRepository, paginationUseCase);
  });

  it("should be able to find all categories by user id", async () => {
    jest.spyOn(categoryRepository, "findAll").mockResolvedValue({
      data: USER_1_CATEGORIES_MOCK,
      total: USER_1_CATEGORIES_MOCK.length
    });

    const result = await sut.execute(
      USER_MOCK.id,
      CATEGORIES_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, USER_1_PAGINATED_CATEGORIES_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findAll,
      calledWith: [
        USER_MOCK.id,
        CATEGORIES_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK
      ]
    });
  });

  it("should return an empty array if the user has no categories", async () => {
    jest
      .spyOn(categoryRepository, "findAll")
      .mockResolvedValue({ data: [], total: 0 });

    const result = await sut.execute(
      USER_MOCK.id,
      CATEGORIES_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, PAGINATION_EMPTY_RESULT_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findAll,
      calledWith: [1, CATEGORIES_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK]
    });
  });
});
