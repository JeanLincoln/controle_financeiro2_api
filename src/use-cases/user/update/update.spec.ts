import { UpdateUserUseCase } from "./update.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { UserRepository } from "@domain/repositories/user.repository";
import { CREATE_OR_UPDATE_USER_PARAMS_MOCK } from "@test/mocks/user.mock";
import { CryptographyAdapterStub } from "@test/stubs/adapters/cryptography.stub";
import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";

describe("UpdateUserUseCase", () => {
  let sut: UpdateUserUseCase;
  let userRepository: UserRepository;
  let cryptographyAdapter: CryptographyAdapter;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    cryptographyAdapter = new CryptographyAdapterStub();
    sut = new UpdateUserUseCase(userRepository, cryptographyAdapter);
  });

  it("should be able to update a user", async () => {
    jest.spyOn(cryptographyAdapter, "hash").mockResolvedValue("hashedPassword");
    jest.spyOn(userRepository, "update");

    const result = await sut.execute(1, CREATE_OR_UPDATE_USER_PARAMS_MOCK);

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: cryptographyAdapter.hash,
      calledWith: { password: CREATE_OR_UPDATE_USER_PARAMS_MOCK.password }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.update,
      calledWith: {
        id: 1,
        user: {
          ...CREATE_OR_UPDATE_USER_PARAMS_MOCK,
          password: "hashedPassword"
        }
      }
    });
  });
});
