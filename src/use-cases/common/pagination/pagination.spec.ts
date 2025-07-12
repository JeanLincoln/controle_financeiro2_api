import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PaginationUseCase
} from "./pagination.use-case";

describe("PaginationUseCase", () => {
  let sut: PaginationUseCase;

  beforeEach(() => {
    sut = new PaginationUseCase();
  });

  const PAGE_MOCK = 2;
  const LIMIT_MOCK = 20;

  it("should return all props to paginate a entity", async () => {
    const result = await sut.execute(PAGE_MOCK, LIMIT_MOCK);

    testUtils.resultExpectations(result, {
      paginationParams: {
        page: PAGE_MOCK,
        limit: LIMIT_MOCK
      },
      repositoryParams: {
        skip: (PAGE_MOCK - 1) * LIMIT_MOCK,
        take: LIMIT_MOCK
      },
      createPaginationResult: expect.any(Function)
    });
  });

  it("should return a default pagination params if no params are provided", async () => {
    jest.spyOn(sut, "execute");

    const result = await sut.execute();

    testUtils.resultExpectations(result, {
      paginationParams: {
        page: PAGINATION_DEFAULT_PAGE,
        limit: PAGINATION_DEFAULT_LIMIT
      },
      repositoryParams: {
        skip: (PAGINATION_DEFAULT_PAGE - 1) * PAGINATION_DEFAULT_LIMIT,
        take: PAGINATION_DEFAULT_LIMIT
      },
      createPaginationResult: expect.any(Function)
    });
  });
});
