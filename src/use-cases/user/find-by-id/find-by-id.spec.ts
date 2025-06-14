import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { FindByIdUserUseCase } from "./find-by-id.use-case";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { UserRepository } from "@domain/repositories/user.repository";
import { USER_MOCK } from "@test/mocks/user.mock";
describe("FindByIdUserUseCase", () => {
  let sut: FindByIdUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindByIdUserUseCase(userRepository, exceptionsAdapter);

    jest.spyOn(exceptionsAdapter, "notFound");
  });

  it("should be able to find a user by id", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    const user = await sut.execute(1);

    testUtils.resultExpectations(user, USER_MOCK);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: { id: 1 }
    });
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);

    const user = await sut.execute(1);

    testUtils.resultExpectations(user, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: { id: 1 }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [{ message: "User not found" }]
    });
  });
});
