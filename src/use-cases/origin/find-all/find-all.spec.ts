import { OriginRepository } from "@domain/repositories/origin.repository";
import { FindAllOriginUseCase } from "./find-all.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { USER_MOCK } from "@test/mocks/user.mock";
import {
  ORIGINS_PAGINATION_AND_SORT_PARAMS_MOCK,
  ORIGINS_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK,
  USER_1_ORIGINS_MOCK,
  USER_1_PAGINATED_ORIGINS_MOCK,
  USER_2_ORIGINS_MOCK
} from "@test/mocks/origin.mock";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";
import { PAGINATION_EMPTY_RESULT_MOCK } from "@test/mocks/pagination.mock";
import { CATEGORIES_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK } from "@test/mocks/category.mock";

describe("FindAllOriginUseCase", () => {
  let sut: FindAllOriginUseCase;
  let originRepository: OriginRepository;
  let exceptionsAdapter: ExceptionsAdapter;
  let paginationUseCase: PaginationUseCase;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    paginationUseCase = new PaginationUseCase();

    sut = new FindAllOriginUseCase(
      originRepository,
      exceptionsAdapter,
      paginationUseCase
    );

    jest.spyOn(exceptionsAdapter, "internalServerError");
    jest.spyOn(exceptionsAdapter, "forbidden");
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
    testUtils.notCalledExpectations([
      exceptionsAdapter.internalServerError,
      exceptionsAdapter.forbidden
    ]);
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
    testUtils.notCalledExpectations([
      exceptionsAdapter.internalServerError,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findAll,
      calledWith: [1, ORIGINS_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK]
    });
  });

  it("should throw an error if there is at least one origin that doesn't belong to the user", async () => {
    jest.spyOn(originRepository, "findAll").mockResolvedValue({
      data: USER_2_ORIGINS_MOCK,
      total: USER_2_ORIGINS_MOCK.length
    });

    const result = await sut.execute(
      USER_MOCK.id,
      ORIGINS_PAGINATION_AND_SORT_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionsAdapter.internalServerError]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findAll,
      calledWith: [
        USER_MOCK.id,
        ORIGINS_PAGINATION_AND_SORT_TO_REPOSITORY_PARAMS_MOCK
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [
        {
          message: "You are not allowed to access this origin"
        }
      ]
    });
  });
});
