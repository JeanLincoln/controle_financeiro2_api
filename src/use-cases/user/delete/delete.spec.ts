import { DeleteUserUseCase } from "./delete.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { UserRepository } from "@domain/repositories/user.repository";
import { USER_MOCK } from "@test/mocks/user.mock";

describe("DeleteUserUseCase", () => {
  let sut: DeleteUserUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    sut = new DeleteUserUseCase(userRepository);
  });

  it("should be able to delete a user", async () => {
    jest.spyOn(userRepository, "delete");

    const result = await sut.execute(USER_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.delete,
      calledWith: { id: 1 }
    });
  });

  it("should delete all categories of the user", async () => {
    jest.spyOn(userRepository, "delete");

    const result = await sut.execute(USER_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.delete,
      calledWith: { id: USER_MOCK.id }
    });
  });
});
