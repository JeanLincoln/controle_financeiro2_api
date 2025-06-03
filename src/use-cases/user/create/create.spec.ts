import {
  UserRepository,
  type CreateOrUpdatePutUserProps
} from "@domain/repositories/user.repository";
import { CreateUserUseCase } from ".";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import type { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import type { User } from "@domain/entities/user.entity";
import type { CryptographyAdapter } from "@domain/adapters/cryptography";
import { CryptographyAdapterStub } from "@test/stubs/adapters/cryptography.stub";

describe("CreateUserUseCase", () => {
  let sut: CreateUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;
  let cryptographyAdapter: CryptographyAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    cryptographyAdapter = new CryptographyAdapterStub();
    sut = new CreateUserUseCase(
      userRepository,
      exceptionsAdapter,
      cryptographyAdapter
    );
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

  const REQUEST_PARAMS: CreateOrUpdatePutUserProps = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "123456",
    birthDate: new Date()
  };

  it("should be able to create a new user", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(userRepository, "create");
    jest.spyOn(exceptionsAdapter, "badRequest");
    jest.spyOn(cryptographyAdapter, "hash").mockResolvedValue("hashedPassword");

    await sut.execute(REQUEST_PARAMS);

    expect(exceptionsAdapter.badRequest).not.toHaveBeenCalled();
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      REQUEST_PARAMS.email
    );
    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(userRepository.create).toHaveBeenCalledWith({
      ...REQUEST_PARAMS,
      password: "hashedPassword"
    });
    expect(cryptographyAdapter.hash).toHaveBeenCalledTimes(1);
    expect(cryptographyAdapter.hash).toHaveBeenCalledWith(
      REQUEST_PARAMS.password
    );
  });

  it("should throw an error if the user already exists", async () => {
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(USER_MOCK);
    jest.spyOn(exceptionsAdapter, "badRequest");
    jest.spyOn(userRepository, "create");
    jest.spyOn(cryptographyAdapter, "hash");

    await sut.execute(REQUEST_PARAMS);

    expect(exceptionsAdapter.badRequest).toHaveBeenCalledWith({
      message: "User already exists"
    });
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      REQUEST_PARAMS.email
    );
    expect(userRepository.create).not.toHaveBeenCalled();
    expect(cryptographyAdapter.hash).not.toHaveBeenCalled();
  });
});
