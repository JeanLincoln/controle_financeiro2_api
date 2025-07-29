import { UserRepository } from "@domain/repositories/user.repository";
import { CreateUserUseCase } from "./create.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";
import { CryptographyAdapterStub } from "@test/stubs/adapters/cryptography.stub";
import {
  BASE_USER_MOCK,
  CREATE_OR_UPDATE_USER_PARAMS_MOCK,
  USER_MOCK
} from "@test/mocks/user.mock";
import { LoginUseCase } from "@use-cases/auth/login/login.use-case";
import { JwtAdapter } from "@domain/adapters/jwt.adapter";
import { JwtAdapterStub } from "@test/stubs/adapters/jwt.stub";
import { generateResponseMock } from "@test/mocks/auth.mock";

describe("CreateUserUseCase", () => {
  let sut: CreateUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;
  let cryptographyAdapter: CryptographyAdapter;
  let jwtAdapter: JwtAdapter;
  let loginUseCase: LoginUseCase;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    cryptographyAdapter = new CryptographyAdapterStub();
    jwtAdapter = new JwtAdapterStub();
    loginUseCase = new LoginUseCase(
      jwtAdapter,
      userRepository,
      exceptionsAdapter,
      cryptographyAdapter
    );
    sut = new CreateUserUseCase(
      userRepository,
      exceptionsAdapter,
      cryptographyAdapter,
      loginUseCase
    );
  });

  it("should be able to create a new user", async () => {
    jest.spyOn(userRepository, "create");
    jest.spyOn(exceptionsAdapter, "badRequest");
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(loginUseCase, "execute").mockResolvedValue(BASE_USER_MOCK);
    jest.spyOn(cryptographyAdapter, "hash").mockResolvedValue("hashedPassword");

    const RESPONSE_MOCK = generateResponseMock();

    const result = await sut.execute(
      CREATE_OR_UPDATE_USER_PARAMS_MOCK,
      RESPONSE_MOCK
    );

    testUtils.resultExpectations(result, BASE_USER_MOCK);
    testUtils.notCalledExpectations([exceptionsAdapter.badRequest]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findByEmail,
      calledWith: { email: CREATE_OR_UPDATE_USER_PARAMS_MOCK.email }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: loginUseCase.execute,
      calledWith: [
        CREATE_OR_UPDATE_USER_PARAMS_MOCK.email,
        CREATE_OR_UPDATE_USER_PARAMS_MOCK.password,
        RESPONSE_MOCK
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.create,
      calledWith: [
        {
          ...CREATE_OR_UPDATE_USER_PARAMS_MOCK,
          password: "hashedPassword"
        }
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: cryptographyAdapter.hash,
      calledWith: { password: CREATE_OR_UPDATE_USER_PARAMS_MOCK.password }
    });
  });

  it("should throw an error if the user already exists", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(USER_MOCK);
    jest.spyOn(loginUseCase, "execute").mockResolvedValue(undefined);
    jest.spyOn(exceptionsAdapter, "badRequest");
    jest.spyOn(userRepository, "create");
    jest.spyOn(cryptographyAdapter, "hash");

    const RESPONSE_MOCK = generateResponseMock();

    const result = await sut.execute(
      CREATE_OR_UPDATE_USER_PARAMS_MOCK,
      RESPONSE_MOCK
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      userRepository.create,
      cryptographyAdapter.hash,
      loginUseCase.execute
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findByEmail,
      calledWith: { email: CREATE_OR_UPDATE_USER_PARAMS_MOCK.email }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.badRequest,
      calledWith: [{ message: "User already exists" }]
    });
  });
});
