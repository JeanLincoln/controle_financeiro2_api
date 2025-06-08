import { DeleteUserUseCase } from "./delete.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { UserRepository } from "@domain/repositories/user.repository";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { USER_MOCK, USER_MOCK_2 } from "@test/mocks/user.mock";
import * as testUtils from "@test/utils/test-utils";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";

describe("DeleteUserUseCase", () => {
  let sut: DeleteUserUseCase;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    categoryRepository = new CategoryRepositoryStub();
    sut = new DeleteUserUseCase(
      userRepository,
      exceptionsAdapter,
      categoryRepository
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should be able to delete a user", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(userRepository, "delete");

    const result = await sut.execute(USER_MOCK.id, USER_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: { id: 1 }
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.delete,
      calledWith: { id: 1 }
    });
  });

  it("should throw an error if the user is not found", async () => {
    jest.spyOn(userRepository, "delete");
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(USER_MOCK.id, USER_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      userRepository.delete,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: [USER_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: { payload: { message: "User not found" } }
    });
  });

  it("should throw an error if the user is not the same as the one to delete", async () => {
    jest.spyOn(userRepository, "delete");
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    const result = await sut.execute(USER_MOCK.id, USER_MOCK_2.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      userRepository.delete,
      userRepository.findById,
      exceptionsAdapter.notFound
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: {
        payload: { message: "You are not allowed to delete this user" }
      }
    });
  });

  it("should delete all categories of the user", async () => {
    jest.spyOn(categoryRepository, "deleteByUserId");
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(userRepository, "delete");

    const result = await sut.execute(USER_MOCK.id, USER_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: { id: USER_MOCK.id }
    });
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

  it.todo("should delete all transactions of the user");
  it.todo("should delete all subcategories of the user");
});
