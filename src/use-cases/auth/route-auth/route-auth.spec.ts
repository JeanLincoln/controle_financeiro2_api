import { JwtAdapter } from "@domain/adapters/jwt.adapter";
import { RouteAuthUseCase } from "./route-auth.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { UserRepository } from "@domain/repositories/user.repository";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { JwtAdapterStub } from "@test/stubs/adapters/jwt.stub";
import { USER_MOCK } from "@test/mocks/user.mock";
import { REQUEST_MOCK } from "@test/mocks/auth.mock";
import { INVALID_TOKEN_MOCK } from "@test/mocks/auth.mock";
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

  it("should return true if the user is authenticated", async () => {
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(exceptionAdapter, "unauthorized");
    jest.spyOn(jwtAdapter, "verifyToken").mockResolvedValue({
      id: "1"
    });
    jest
      .spyOn(userRepository, "findUserWithAllProps")
      .mockResolvedValue(USER_MOCK);

    const result = await sut.execute(REQUEST_MOCK);

    testUtils.resultExpectations(result, true);
    testUtils.notCalledExpectations([exceptionAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: jwtAdapter.verifyToken,
      calledWith: { token: "token" }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findUserWithAllProps,
      calledWith: [{ id: USER_MOCK.id }]
    });
  });

  it("should return false and throw an error if the token is not provided", async () => {
    jest.spyOn(userRepository, "findUserWithAllProps");
    jest.spyOn(jwtAdapter, "verifyToken");
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(exceptionAdapter, "unauthorized");

    const result = await sut.execute(INVALID_TOKEN_MOCK);

    testUtils.resultExpectations(result, false);

    testUtils.notCalledExpectations([
      exceptionAdapter.forbidden,
      userRepository.findUserWithAllProps,
      jwtAdapter.verifyToken
    ]);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionAdapter.unauthorized,
      calledWith: [{ message: "Unauthorized" }]
    });
  });

  it("should return false and throw an error if the token is invalid", async () => {
    jest.spyOn(userRepository, "findUserWithAllProps");
    jest.spyOn(jwtAdapter, "verifyToken").mockResolvedValue(undefined);
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(exceptionAdapter, "unauthorized");

    const result = await sut.execute(REQUEST_MOCK);

    testUtils.resultExpectations(result, false);

    testUtils.notCalledExpectations([
      exceptionAdapter.unauthorized,
      userRepository.findUserWithAllProps
    ]);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionAdapter.forbidden,
      calledWith: [{ message: "Invalid token" }]
    });
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(exceptionAdapter, "forbidden");
    jest.spyOn(exceptionAdapter, "unauthorized");
    jest.spyOn(jwtAdapter, "verifyToken").mockResolvedValue({
      id: "1"
    });
    jest.spyOn(userRepository, "findUserWithAllProps").mockResolvedValue(null);

    const result = await sut.execute(REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionAdapter.unauthorized]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionAdapter.forbidden,
      calledWith: [{ message: "Invalid token" }]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: jwtAdapter.verifyToken,
      calledWith: { token: "token" }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findUserWithAllProps,
      calledWith: [{ id: USER_MOCK.id }]
    });
  });
});
