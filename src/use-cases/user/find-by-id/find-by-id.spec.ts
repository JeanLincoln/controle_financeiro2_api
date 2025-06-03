import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { FindByIdUserUseCase } from ".";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import type { ExceptionsAdapter } from "@domain/adapters/exceptions";
import type { UserRepository } from "@domain/repositories/user.repository";
import type { User } from "@domain/entities/user.entity";

describe("FindByIdUserUseCase", () => {
  let sut: FindByIdUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindByIdUserUseCase(userRepository, exceptionsAdapter);
  });

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

  it("should be able to find a user by id", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(exceptionsAdapter, "notFound");

    const user = await sut.execute(1);

    expect(exceptionsAdapter.notFound).not.toHaveBeenCalled();
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
    expect(user).toEqual(USER_MOCK);
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);
    jest.spyOn(exceptionsAdapter, "notFound");

    await sut.execute(1);

    expect(exceptionsAdapter.notFound).toHaveBeenCalledWith({
      message: "User not found"
    });
  });
});
