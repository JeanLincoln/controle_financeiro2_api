import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { FindByEmailUserUseCase } from "./find-by-email.use-case";
import { UserRepository } from "@domain/repositories/user.repository";
import { USER_MOCK } from "@test/mocks/user.mock";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
describe("FindByEmailUserUseCase", () => {
  let sut: FindByEmailUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindByEmailUserUseCase(userRepository, exceptionsAdapter);

    jest.spyOn(exceptionsAdapter, "notFound");
  });

  it("should be able to find a user by email", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(USER_MOCK);

    const user = await sut.execute("john.doe@example.com");

    testUtils.resultExpectations(user, USER_MOCK);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findByEmail,
      calledWith: { email: "john.doe@example.com" }
    });
  });

  it("should return undefined if the user is not found", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);

    const user = await sut.execute("john.doe@example.com");

    testUtils.resultExpectations(user, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findByEmail,
      calledWith: { email: "john.doe@example.com" }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [{ message: "User not found" }]
    });
  });
});
