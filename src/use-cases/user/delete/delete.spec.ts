import { DeleteUserUseCase } from "./delete.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { UserRepository } from "@domain/repositories/user.repository";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { USER_MOCK } from "@test/mocks/user.mock";
import * as testUtils from "@test/utils/test-utils";

describe("DeleteUserUseCase", () => {
  let sut: DeleteUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new DeleteUserUseCase(userRepository, exceptionsAdapter);

    jest.spyOn(exceptionsAdapter, "notFound");
  });

  it("should be able to delete a user", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(userRepository, "delete");

    const result = await sut.execute(1);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: { id: 1 }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.delete,
      calledWith: { id: 1 }
    });
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(userRepository, "delete");
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(1);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([userRepository.delete]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: { id: 1 }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: { payload: { message: "User not found" } }
    });
  });
});
