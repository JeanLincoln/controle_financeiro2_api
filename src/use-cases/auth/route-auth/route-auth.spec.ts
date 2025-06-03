import type { JwtAdapter } from "@domain/adapters/jwt";
import { RouteAuthUseCase, type AuthenticatedRequest } from ".";
import type { ExceptionsAdapter } from "@domain/adapters/exceptions";
import type { UserRepository } from "@domain/repositories/user.repository";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { JwtAdapterStub } from "@test/stubs/adapters/jwt.stub";
import type { User } from "@domain/entities/user.entity";

describe("RouteAuthUseCase", () => {
  let sut: RouteAuthUseCase;
  let jwtAdapter: JwtAdapter;
  let exceptionAdapter: ExceptionsAdapter;
  let userRepository: UserRepository;

  beforeEach(async () => {
    jwtAdapter = new JwtAdapterStub();
    exceptionAdapter = new ExceptionsAdapterStub();
    userRepository = new UserRepositoryStub();
    sut = new RouteAuthUseCase(jwtAdapter, exceptionAdapter, userRepository);
  });

  const REQUEST_MOCK = {
    cookies: {
      authentication: "token"
    }
  } as AuthenticatedRequest;

  const INVALID_TOKEN_MOCK = {
    ...REQUEST_MOCK,
    cookies: {
      authentication: ""
    }
  } as AuthenticatedRequest;

  const USER_MOCK: Omit<User, "transactions"> = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "123456",
    birthDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it("should return true if the user is authenticated", async () => {
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(exceptionAdapter, "unauthorized");
    jest.spyOn(jwtAdapter, "verifyToken").mockResolvedValue({
      id: "1"
    });
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    const result = await sut.execute(REQUEST_MOCK);

    expect(result).toBe(true);
    expect(exceptionAdapter.forbidden).not.toHaveBeenCalled();
    expect(jwtAdapter.verifyToken).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should return false and throw an error if the token is invalid", async () => {
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(exceptionAdapter, "unauthorized");
    jest.spyOn(jwtAdapter, "verifyToken").mockResolvedValue(undefined);
    jest.spyOn(userRepository, "findById");

    const result = await sut.execute(INVALID_TOKEN_MOCK);

    expect(result).toBe(false);
    expect(exceptionAdapter.unauthorized).toHaveBeenCalledTimes(1);
    expect(exceptionAdapter.forbidden).not.toHaveBeenCalled();
    expect(jwtAdapter.verifyToken).not.toHaveBeenCalled();
    expect(userRepository.findById).not.toHaveBeenCalled();
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(exceptionAdapter, "unauthorized");
    jest.spyOn(jwtAdapter, "verifyToken").mockResolvedValue({
      id: "1"
    });
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(REQUEST_MOCK);

    expect(result).toBe(false);
    expect(exceptionAdapter.unauthorized).not.toHaveBeenCalled();
    expect(exceptionAdapter.forbidden).toHaveBeenCalledTimes(1);
    expect(jwtAdapter.verifyToken).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
  });
});
