import { FindAllUserUseCase } from "./find-all.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { UserRepository } from "@domain/repositories/user.repository";
import { USERS_MOCK } from "@test/mocks/user.mock";
import * as testUtils from "@test/utils/test-utils";

describe("FindAllUserUseCase", () => {
  let sut: FindAllUserUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    sut = new FindAllUserUseCase(userRepository);
  });

  it("should be able to find all users", async () => {
    jest.spyOn(userRepository, "findAll").mockResolvedValue(USERS_MOCK);

    const users = await sut.execute();

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findAll,
      calledWith: {}
    });
    testUtils.arrayExpectations({
      result: users,
      expected: USERS_MOCK,
      length: USERS_MOCK.length
    });
  });

  it("should return an empty array if no users are found", async () => {
    jest.spyOn(userRepository, "findAll").mockResolvedValue([]);

    const users = await sut.execute();

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findAll,
      calledWith: {}
    });
    testUtils.arrayExpectations({
      result: users,
      expected: [],
      length: 0
    });
  });
});
