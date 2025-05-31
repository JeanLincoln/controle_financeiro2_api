import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { FindByEmailUserUseCase } from ".";
import type { UserRepository } from "@domain/repositories/user.repository";
import type { User } from "@domain/entities/user.entity";

describe("FindByEmailUserUseCase", () => {
  let sut: FindByEmailUserUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    sut = new FindByEmailUserUseCase(userRepository);
  });

  const USER_MOCK: User = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "123456",
    birthDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it("should be able to find a user by email", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(USER_MOCK);

    const user = await sut.execute("john.doe@example.com");

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      "john.doe@example.com"
    );
    expect(user).toEqual(USER_MOCK);
  });

  it("should return undefined if the user is not found", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);

    const user = await sut.execute("john.doe@example.com");

    expect(user).toBeNull();
  });
});
