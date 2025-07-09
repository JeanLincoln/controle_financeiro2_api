import { FindAllUserUseCase } from "./find-all.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { UserRepository } from "@domain/repositories/user.repository";
import { USERS_MOCK, USERS_PAGINATED_MOCK } from "@test/mocks/user.mock";
import { PaginationUseCase } from "@use-cases/pagination/pagination.use-case";
import {
  PAGINATION_EMPTY_RESULT_MOCK,
  PAGINATION_PARAMS_MOCK,
  PAGINATION_TO_REPOSITORY_PARAMS_MOCK
} from "@test/mocks/pagination.mock";
describe("FindAllUserUseCase", () => {
  let sut: FindAllUserUseCase;
  let userRepository: UserRepository;
  let paginationUseCase: PaginationUseCase;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    paginationUseCase = new PaginationUseCase();

    sut = new FindAllUserUseCase(userRepository, paginationUseCase);
  });

  it("should be able to find all users", async () => {
    jest
      .spyOn(userRepository, "findAll")
      .mockResolvedValue({ data: USERS_MOCK, total: USERS_MOCK.length });

    const { page, limit } = PAGINATION_PARAMS_MOCK;

    const result = await sut.execute(page, limit);

    testUtils.resultExpectations(result, USERS_PAGINATED_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findAll,
      calledWith: [PAGINATION_TO_REPOSITORY_PARAMS_MOCK]
    });
  });

  it("should return an empty array if no users are found", async () => {
    jest
      .spyOn(userRepository, "findAll")
      .mockResolvedValue({ data: [], total: 0 });

    const { page, limit } = PAGINATION_PARAMS_MOCK;

    const result = await sut.execute(page, limit);

    testUtils.resultExpectations(result, PAGINATION_EMPTY_RESULT_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findAll,
      calledWith: [PAGINATION_TO_REPOSITORY_PARAMS_MOCK]
    });
  });
});
