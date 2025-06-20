import { UpdateUserUseCase } from "./update.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { UserRepository } from "@domain/repositories/user.repository";
import {
  CREATE_OR_UPDATE_USER_PARAMS_MOCK,
  USER_MOCK
} from "@test/mocks/user.mock";
import { CryptographyAdapterStub } from "@test/stubs/adapters/cryptography.stub";
import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";

describe("UpdateUserUseCase", () => {
  let sut: UpdateUserUseCase;
  let userRepository: UserRepository;
  let cryptographyAdapter: CryptographyAdapter;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    cryptographyAdapter = new CryptographyAdapterStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new UpdateUserUseCase(
      userRepository,
      cryptographyAdapter,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "badRequest");
  });

  it("should be able to update a user", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(cryptographyAdapter, "hash").mockResolvedValue("hashedPassword");
    jest.spyOn(userRepository, "update");

    const result = await sut.execute(
      USER_MOCK,
      CREATE_OR_UPDATE_USER_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionsAdapter.badRequest]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: cryptographyAdapter.hash,
      calledWith: { password: CREATE_OR_UPDATE_USER_PARAMS_MOCK.password }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findByEmail,
      calledWith: { email: CREATE_OR_UPDATE_USER_PARAMS_MOCK.email }
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

  it("should not be able to update a user if the email is already in use", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(USER_MOCK);
    jest.spyOn(cryptographyAdapter, "hash").mockResolvedValue("hashedPassword");
    jest.spyOn(userRepository, "update");

    const result = await sut.execute(
      USER_MOCK,
      CREATE_OR_UPDATE_USER_PARAMS_MOCK
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      cryptographyAdapter.hash,
      userRepository.update
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findByEmail,
      calledWith: { email: CREATE_OR_UPDATE_USER_PARAMS_MOCK.email }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.badRequest,
      calledWith: [{ message: "Email already in use" }]
    });
  });
});
