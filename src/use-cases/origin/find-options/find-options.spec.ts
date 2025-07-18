import { OriginRepository } from "@domain/repositories/origin.repository";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";
import { USER_MOCK } from "@test/mocks/user.mock";
import {
  ORIGINS_OPTIONS_MOCK,
  PAGINATED_ORIGINS_OPTIONS_MOCK
} from "@test/mocks/origin.mock";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";
import {
  OPTIONS_PAGINATION_AND_SORT_PARAMS_MOCK,
  OPTIONS_PAGINATION_TO_REPOSITORY_PARAMS_MOCK,
  PAGINATION_EMPTY_RESULT_MOCK
} from "@test/mocks/pagination.mock";
import { FindOptionsOriginUseCase } from "./find-options.use-case";

describe("FindOptionsOriginUseCase", () => {
  let sut: FindOptionsOriginUseCase;
  let originRepository: OriginRepository;
  let paginationUseCase: PaginationUseCase;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    paginationUseCase = new PaginationUseCase();

    sut = new FindOptionsOriginUseCase(originRepository, paginationUseCase);
  });

  it("should return all users origins options", async () => {
    jest.spyOn(originRepository, "findOptions").mockResolvedValue({
      data: ORIGINS_OPTIONS_MOCK,
      total: ORIGINS_OPTIONS_MOCK.length
    });

    const result = await sut.execute(
      USER_MOCK.id,
      OPTIONS_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, PAGINATED_ORIGINS_OPTIONS_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findOptions,
      calledWith: [USER_MOCK.id, OPTIONS_PAGINATION_TO_REPOSITORY_PARAMS_MOCK]
    });
  });

  it("should return an empty array if the user has no origins options", async () => {
    jest
      .spyOn(originRepository, "findOptions")
      .mockResolvedValue({ data: [], total: 0 });

    const result = await sut.execute(
      USER_MOCK.id,
      OPTIONS_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, PAGINATION_EMPTY_RESULT_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findOptions,
      calledWith: [1, OPTIONS_PAGINATION_TO_REPOSITORY_PARAMS_MOCK]
    });
  });
});
