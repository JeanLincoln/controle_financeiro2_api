import { UserRepository } from "@domain/repositories/user.repository";
import { CreateUserUseCase } from "./create.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";
import { CryptographyAdapterStub } from "@test/stubs/adapters/cryptography.stub";
import {
  CREATE_OR_UPDATE_USER_PARAMS_MOCK,
  USER_MOCK
} from "@test/mocks/user.mock";
import * as testUtils from "@test/utils/test-utils";

describe("CreateUserUseCase", () => {
  let sut: CreateUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;
  let cryptographyAdapter: CryptographyAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    cryptographyAdapter = new CryptographyAdapterStub();
    sut = new CreateUserUseCase(
      userRepository,
      exceptionsAdapter,
      cryptographyAdapter
    );
  });

  it("should be able to create a new user", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(userRepository, "create");
    jest.spyOn(exceptionsAdapter, "badRequest");
    jest.spyOn(cryptographyAdapter, "hash").mockResolvedValue("hashedPassword");

    const result = await sut.execute(CREATE_OR_UPDATE_USER_PARAMS_MOCK);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionsAdapter.badRequest]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findByEmail,
      calledWith: { email: CREATE_OR_UPDATE_USER_PARAMS_MOCK.email }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.create,
      calledWith: {
        payload: {
          ...CREATE_OR_UPDATE_USER_PARAMS_MOCK,
          password: "hashedPassword"
        }
      }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: cryptographyAdapter.hash,
      calledWith: { password: CREATE_OR_UPDATE_USER_PARAMS_MOCK.password }
    });
  });

  it("should throw an error if the user already exists", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(USER_MOCK);
    jest.spyOn(exceptionsAdapter, "badRequest");
    jest.spyOn(userRepository, "create");
    jest.spyOn(cryptographyAdapter, "hash");

    const result = await sut.execute(CREATE_OR_UPDATE_USER_PARAMS_MOCK);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      userRepository.create,
      cryptographyAdapter.hash
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findByEmail,
      calledWith: { email: CREATE_OR_UPDATE_USER_PARAMS_MOCK.email }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.badRequest,
      calledWith: { payload: { message: "User already exists" } }
    });
  });
});
