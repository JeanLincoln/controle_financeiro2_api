import { DeleteUserUseCase } from ".";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import type { UserRepository } from "@domain/repositories/user.repository";
import type { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import type { User } from "@domain/entities/user.entity";

describe("DeleteUserUseCase", () => {
  let sut: DeleteUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new DeleteUserUseCase(userRepository, exceptionsAdapter);
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

  it("should be able to delete a user", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(userRepository, "delete");
    jest.spyOn(exceptionsAdapter, "notFound");

    await sut.execute(1);

    expect(exceptionsAdapter.notFound).not.toHaveBeenCalled();
    expect(userRepository.delete).toHaveBeenCalledTimes(1);
    expect(userRepository.delete).toHaveBeenCalledWith(1);
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(userRepository, "delete");
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);
    jest.spyOn(exceptionsAdapter, "notFound");

    await sut.execute(1);

    expect(exceptionsAdapter.notFound).toHaveBeenCalledWith({
      message: "User not found"
    });
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
