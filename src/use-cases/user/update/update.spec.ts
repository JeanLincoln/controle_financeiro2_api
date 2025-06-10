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
import { CryptographyAdapterStub } from "@test/stubs/adapters/cryptography.stub";
import type { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";

describe("UpdateUserUseCase", () => {
  let sut: UpdateUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;
  let cryptographyAdapter: CryptographyAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    cryptographyAdapter = new CryptographyAdapterStub();
    sut = new UpdateUserUseCase(
      userRepository,
      exceptionsAdapter,
      cryptographyAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
  });

  it("should be able to update a user", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(cryptographyAdapter, "hash").mockResolvedValue("hashedPassword");
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
      mockFunction: cryptographyAdapter.hash,
      calledWith: { password: CREATE_OR_UPDATE_USER_PARAMS_MOCK.password }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.update,
      calledWith: {
        id: 1,
        user: {
          ...CREATE_OR_UPDATE_USER_PARAMS_MOCK,
          password: "hashedPassword"
        }
      }
    });
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);
    jest.spyOn(userRepository, "update");
    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(cryptographyAdapter, "hash");

    const result = await sut.execute(1, CREATE_OR_UPDATE_USER_PARAMS_MOCK);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      userRepository.update,
      cryptographyAdapter.hash
    ]);
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
