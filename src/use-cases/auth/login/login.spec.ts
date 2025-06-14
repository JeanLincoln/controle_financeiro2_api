import { JwtAdapter } from "@domain/adapters/jwt.adapter";
import { LoginUseCase } from "./login.use-case";
import { UserRepository } from "@domain/repositories/user.repository";
import { JwtAdapterStub } from "@test/stubs/adapters/jwt.stub";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";
import { CryptographyAdapterStub } from "@test/stubs/adapters/cryptography.stub";
import { USER_MOCK } from "@test/mocks/user.mock";
import { LOGIN_PARAMS } from "@test/mocks/auth.mock";

describe("LoginUseCase", () => {
  let sut: LoginUseCase;
  let jwtAdapter: JwtAdapter;
  let userRepository: UserRepository;
  let exceptionAdapter: ExceptionsAdapter;
  let cryptographyAdapter: CryptographyAdapter;

  beforeEach(() => {
    jwtAdapter = new JwtAdapterStub();
    userRepository = new UserRepositoryStub();
    exceptionAdapter = new ExceptionsAdapterStub();
    cryptographyAdapter = new CryptographyAdapterStub();
    sut = new LoginUseCase(
      jwtAdapter,
      userRepository,
      exceptionAdapter,
      cryptographyAdapter
    );
  });

  it("should be able to login", async () => {
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(USER_MOCK);
    jest.spyOn(jwtAdapter, "generateToken").mockResolvedValue("token");
    jest.spyOn(cryptographyAdapter, "compare").mockResolvedValue(true);

    const result = await sut.execute(LOGIN_PARAMS.email, LOGIN_PARAMS.password);

    testUtils.resultExpectations(result, {
      accessToken: "Bearer token"
    });

    testUtils.notCalledExpectations([exceptionAdapter.forbidden]);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findByEmail,
      calledWith: [LOGIN_PARAMS.email]
    });

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: jwtAdapter.generateToken,
      calledWith: [
        { id: USER_MOCK.id.toString() },
        {
          expiresIn: "2 days",
          subject: USER_MOCK.id.toString(),
          issuer: "controle-financeiro",
          audience: "users"
        }
      ]
    });

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: cryptographyAdapter.compare,
      calledWith: [LOGIN_PARAMS.password, USER_MOCK.password]
    });
  });

  it("should not be able to login if user not found", async () => {
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(jwtAdapter, "generateToken");
    jest.spyOn(cryptographyAdapter, "compare");

    const result = await sut.execute(LOGIN_PARAMS.email, LOGIN_PARAMS.password);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      jwtAdapter.generateToken,
      cryptographyAdapter.compare
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findByEmail,
      calledWith: [LOGIN_PARAMS.email]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionAdapter.forbidden,
      calledWith: [{ message: "Invalid credentials" }]
    });
  });
});
