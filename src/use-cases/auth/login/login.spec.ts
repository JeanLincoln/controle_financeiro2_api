import { JwtAdapter } from "@domain/adapters/jwt";
import { LoginUseCase } from "./index";
import { UserRepository } from "@domain/repositories/user.repository";
import { JwtAdapterStub } from "@test/stubs/adapters/jwt.stub";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import type { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CryptographyAdapter } from "@domain/adapters/cryptography";
import { CryptographyAdapterStub } from "@test/stubs/adapters/cryptography.stub";
import type { User } from "@domain/entities/user.entity";

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

  const LOGIN_PARAMS = {
    email: "john.doe@example.com",
    password: "Password123!"
  };

  const USER_MOCK: Omit<User, "transactions"> = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "hashedPassword",
    birthDate: new Date("1990-01-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it("should be able to login", async () => {
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(USER_MOCK);
    jest.spyOn(jwtAdapter, "generateToken").mockResolvedValue("token");
    jest.spyOn(cryptographyAdapter, "compare").mockResolvedValue(true);

    const result = await sut.execute(LOGIN_PARAMS.email, LOGIN_PARAMS.password);

    expect(exceptionAdapter.forbidden).not.toHaveBeenCalled();
    expect(userRepository.findByEmail).toHaveBeenCalledWith(LOGIN_PARAMS.email);
    expect(jwtAdapter.generateToken).toHaveBeenCalledWith(
      {
        id: USER_MOCK.id.toString()
      },
      {
        expiresIn: "2 days",
        subject: USER_MOCK.id.toString(),
        issuer: "controle-financeiro",
        audience: "users"
      }
    );
    expect(cryptographyAdapter.compare).toHaveBeenCalledWith(
      LOGIN_PARAMS.password,
      USER_MOCK.password
    );
    expect(result).toEqual({
      accessToken: "Bearer token"
    });
  });

  it("should not be able to login if user not found", async () => {
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(jwtAdapter, "generateToken");
    jest.spyOn(cryptographyAdapter, "compare");

    await sut.execute(LOGIN_PARAMS.email, LOGIN_PARAMS.password);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(LOGIN_PARAMS.email);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(exceptionAdapter.forbidden).toHaveBeenCalledTimes(1);
    expect(jwtAdapter.generateToken).not.toHaveBeenCalled();
    expect(cryptographyAdapter.compare).not.toHaveBeenCalled();
  });
});
