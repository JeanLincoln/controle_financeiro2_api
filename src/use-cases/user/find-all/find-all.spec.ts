import { FindAllUserUseCase } from "./find-all.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import type { UserRepository } from "@domain/repositories/user.repository";
import type { User } from "@domain/entities/user.entity";

describe("FindAllUserUseCase", () => {
  let sut: FindAllUserUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    sut = new FindAllUserUseCase(userRepository);
  });

  const USERS_MOCK: User[] = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "123456",
      birthDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "123456",
      birthDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  it("should be able to find all users", async () => {
    jest.spyOn(userRepository, "findAll").mockResolvedValue(USERS_MOCK);

    const users = await sut.execute();

    expect(users).toEqual(USERS_MOCK);
    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    expect(users.length).toBe(2);
  });
});
