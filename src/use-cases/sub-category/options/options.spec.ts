import { USER_MOCK } from "@test/mocks/user.mock";

import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";
import { PAGINATION_EMPTY_RESULT_MOCK } from "@test/mocks/pagination.mock";
import { OptionsSubCategoryUseCase } from "./options.use-case";
import {
  PAGINATED_SUB_CATEGORIES_OPTIONS_MOCK,
  SUB_CATEGORIES_OPTIONS_MOCK,
  SUB_CATEGORIES_OPTIONS_PARAMS_MOCK,
  SUB_CATEGORIES_OPTIONS_TO_REPOSITORY_PARAMS_MOCK
} from "@test/mocks/sub-category.mock";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";

describe("OptionsSubCategoryUseCase", () => {
  let sut: OptionsSubCategoryUseCase;
  let subCategoryRepository: SubCategoryRepository;
  let paginationUseCase: PaginationUseCase;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    paginationUseCase = new PaginationUseCase();

    sut = new OptionsSubCategoryUseCase(
      subCategoryRepository,
      paginationUseCase
    );
  });

  it("should return all user's subCategories options", async () => {
    jest.spyOn(subCategoryRepository, "options").mockResolvedValue({
      data: SUB_CATEGORIES_OPTIONS_MOCK,
      total: SUB_CATEGORIES_OPTIONS_MOCK.length
    });

    const result = await sut.execute(
      USER_MOCK.id,
      SUB_CATEGORIES_OPTIONS_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, PAGINATED_SUB_CATEGORIES_OPTIONS_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.options,
      calledWith: [
        USER_MOCK.id,
        SUB_CATEGORIES_OPTIONS_TO_REPOSITORY_PARAMS_MOCK
      ]
    });
  });

  it("should return an empty array if the user has no subCategories options", async () => {
    jest
      .spyOn(subCategoryRepository, "options")
      .mockResolvedValue({ data: [], total: 0 });

    const result = await sut.execute(
      USER_MOCK.id,
      SUB_CATEGORIES_OPTIONS_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, PAGINATION_EMPTY_RESULT_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.options,
      calledWith: [
        USER_MOCK.id,
        SUB_CATEGORIES_OPTIONS_TO_REPOSITORY_PARAMS_MOCK
      ]
    });
  });
});
