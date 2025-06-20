import { DeleteUserUseCase } from "./delete.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { UserRepository } from "@domain/repositories/user.repository";
import { USER_MOCK } from "@test/mocks/user.mock";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";

describe("DeleteUserUseCase", () => {
  let sut: DeleteUserUseCase;
  let userRepository: UserRepository;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    categoryRepository = new CategoryRepositoryStub();
    sut = new DeleteUserUseCase(userRepository, categoryRepository);
  });

  it("should be able to delete a user", async () => {
    jest.spyOn(userRepository, "delete");

    const result = await sut.execute(USER_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.delete,
      calledWith: { id: 1 }
    });
  });

  it("should delete all categories of the user", async () => {
    jest.spyOn(categoryRepository, "deleteByUserId");
    jest.spyOn(userRepository, "delete");

    const result = await sut.execute(USER_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.deleteByUserId,
      calledWith: { userId: USER_MOCK.id }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.delete,
      calledWith: { id: USER_MOCK.id }
    });
  });
});
