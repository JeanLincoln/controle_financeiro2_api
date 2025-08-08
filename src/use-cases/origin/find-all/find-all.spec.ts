import { OriginRepository } from "@domain/repositories/origin.repository";
import { FindAllOriginUseCase } from "./find-all.use-case";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";
import { USER_MOCK } from "@test/mocks/user.mock";
import {
  ORIGINS_PAGINATION_AND_SORT_PARAMS_MOCK,
  ORIGINS_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK,
  USER_1_ORIGINS_MOCK,
  USER_1_PAGINATED_ORIGINS_MOCK
} from "@test/mocks/origin.mock";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";
import { PAGINATION_EMPTY_RESULT_MOCK } from "@test/mocks/pagination.mock";
import { CATEGORIES_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK } from "@test/mocks/category.mock";

describe("FindAllOriginUseCase", () => {
  let sut: FindAllOriginUseCase;
  let originRepository: OriginRepository;
  let paginationUseCase: PaginationUseCase;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    paginationUseCase = new PaginationUseCase();

    sut = new FindAllOriginUseCase(originRepository, paginationUseCase);
  });

  it("should return all users origins", async () => {
    jest.spyOn(originRepository, "findAll").mockResolvedValue({
      data: USER_1_ORIGINS_MOCK,
      total: USER_1_ORIGINS_MOCK.length
    });

    const result = await sut.execute(
      USER_MOCK.id,
      ORIGINS_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, USER_1_PAGINATED_ORIGINS_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findAll,
      calledWith: [
        USER_MOCK.id,
        CATEGORIES_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK
      ]
    });
  });

  it("should return an empty array if the user has no origins", async () => {
    jest
      .spyOn(originRepository, "findAll")
      .mockResolvedValue({ data: [], total: 0 });

    const result = await sut.execute(
      USER_MOCK.id,
      ORIGINS_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, PAGINATION_EMPTY_RESULT_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findAll,
      calledWith: [1, ORIGINS_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK]
    });
  });
});
