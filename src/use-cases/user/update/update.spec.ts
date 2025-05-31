import { UpdateUserUseCase } from ".";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import type {
  CreateOrUpdatePutUserProps,
  UserRepository
} from "@domain/repositories/user.repository";
import type { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ExceptionsStub } from "@test/stubs/adapters/exceptions.stub";
import type { User } from "@domain/entities/user.entity";

describe("UpdateUserUseCase", () => {
  let sut: UpdateUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsStub();
    sut = new UpdateUserUseCase(userRepository, exceptionsAdapter);
  });

  const REQUEST_PARAMS: CreateOrUpdatePutUserProps = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "123456",
    birthDate: new Date()
  };

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

  it("should be able to update a user", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(userRepository, "update");
    jest.spyOn(exceptionsAdapter, "notFound");

    await sut.execute(1, REQUEST_PARAMS);

    expect(exceptionsAdapter.notFound).not.toHaveBeenCalled();
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(userRepository.update).toHaveBeenCalledWith(1, REQUEST_PARAMS);
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);
    jest.spyOn(userRepository, "update");
    jest.spyOn(exceptionsAdapter, "notFound");

    await sut.execute(1, REQUEST_PARAMS);

    expect(exceptionsAdapter.notFound).toHaveBeenCalledTimes(1);
    expect(exceptionsAdapter.notFound).toHaveBeenCalledWith({
      message: "User not found"
    });
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
