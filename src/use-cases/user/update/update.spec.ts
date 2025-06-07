import { UpdateUserUseCase } from "./update.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { UserRepository } from "@domain/repositories/user.repository";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import {
  CREATE_OR_UPDATE_USER_PARAMS_MOCK,
  USER_MOCK
} from "@test/mocks/user.mock";
import * as testUtils from "@test/utils/test-utils";

describe("UpdateUserUseCase", () => {
  let sut: UpdateUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new UpdateUserUseCase(userRepository, exceptionsAdapter);

    jest.spyOn(exceptionsAdapter, "notFound");
  });

  it("should be able to update a user", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(userRepository, "update");

    const result = await sut.execute(1, CREATE_OR_UPDATE_USER_PARAMS_MOCK);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: { id: 1 }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.update,
      calledWith: {
        id: 1,
        user: CREATE_OR_UPDATE_USER_PARAMS_MOCK
      }
    });
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);
    jest.spyOn(userRepository, "update");
    jest.spyOn(exceptionsAdapter, "notFound");

    const result = await sut.execute(1, CREATE_OR_UPDATE_USER_PARAMS_MOCK);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([userRepository.update]);
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
