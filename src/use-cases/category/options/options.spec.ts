import { CategoryRepository } from "@domain/repositories/category.repository";
import { USER_MOCK } from "@test/mocks/user.mock";
import {
  CATEGORIES_OPTIONS_MOCK,
  PAGINATED_CATEGORIES_OPTIONS_MOCK
} from "@test/mocks/category.mock";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";
import {
  OPTIONS_PAGINATION_AND_SORT_PARAMS_MOCK,
  OPTIONS_PAGINATION_TO_REPOSITORY_PARAMS_MOCK,
  PAGINATION_EMPTY_RESULT_MOCK
} from "@test/mocks/pagination.mock";
import { OptionsCategoryUseCase } from "./options.use-case";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";

describe("OptionsCategoryUseCase", () => {
  let sut: OptionsCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let paginationUseCase: PaginationUseCase;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    paginationUseCase = new PaginationUseCase();

    sut = new OptionsCategoryUseCase(categoryRepository, paginationUseCase);
  });

  it("should return all user's categories options", async () => {
    jest.spyOn(categoryRepository, "options").mockResolvedValue({
      data: CATEGORIES_OPTIONS_MOCK,
      total: CATEGORIES_OPTIONS_MOCK.length
    });

    const result = await sut.execute(
      USER_MOCK.id,
      OPTIONS_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, PAGINATED_CATEGORIES_OPTIONS_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.options,
      calledWith: [USER_MOCK.id, OPTIONS_PAGINATION_TO_REPOSITORY_PARAMS_MOCK]
    });
  });

  it("should return an empty array if the user has no categories options", async () => {
    jest
      .spyOn(categoryRepository, "options")
      .mockResolvedValue({ data: [], total: 0 });

    const result = await sut.execute(
      USER_MOCK.id,
      OPTIONS_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, PAGINATION_EMPTY_RESULT_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.options,
      calledWith: [1, OPTIONS_PAGINATION_TO_REPOSITORY_PARAMS_MOCK]
    });
  });
});
